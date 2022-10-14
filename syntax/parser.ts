import { BinarySyntax } from "@syntax/BinarySyntax.ts";
import { Lexer } from "@syntax/lexer.ts";
import { LiteralSyntax } from "@syntax/LiteralSyntax.ts";
import { ParenthesisSyntax } from "@syntax/ParenthesisSyntax.ts";
import { GetBinaryOperatorPrecedence, GetUnaryOperatorPrecedence } from "@syntax/syntaxRules.ts";
import { SyntaxTree } from "@syntax/syntaxTree.ts";
import { SyntaxToken } from "@syntax/token.ts";
import { ExpressionSyntax, SyntaxKind } from "@syntax/types.ts";
import { UnarySyntax } from "@syntax/UnarySyntax.ts";

class Parser {
  private readonly tokens: SyntaxToken[];
  private position: number;

  private diagnostics: string[] = [];

  get Diagnostics(): Iterable<string> {
    return this.diagnostics;
  }

  /**
   * 获取指针当前指向的 Token
   */
  private get Current() {
    return this.Peek(0);
  }

  /**
   * 获取指针当前指向的 Token 并将指针后移一位
   */
  private get NextToken() {
    const current = this.Current;
    this.position++;
    return current;
  }

  /**
   * 获取当前指针后移指定偏移量位置的 Token
   * @param offset 偏移量
   * @returns
   */
  private Peek(offset: number) {
    const index = this.position + offset;

    return index >= this.tokens.length ? this.tokens[this.tokens.length - 1] : this.tokens[index];
  }

  constructor(text: string) {
    const tokens = [];
    const lexer = new Lexer(text);

    let token: SyntaxToken;

    do {
      token = lexer.NextToken();

      if (token.Kind !== SyntaxKind.WhitespaceToken && token.Kind !== SyntaxKind.BadToken) {
        tokens.push(token);
      }
    } while (token.Kind != SyntaxKind.EndOfFileToken);

    this.tokens = tokens;
    this.position = 0;
  }

  private Match(kind: SyntaxKind) {
    if (this.Current.Kind === kind) return this.NextToken;

    this.diagnostics.push(`ERROR: Unexpected token <${this.Current.Kind}>, expected <${kind}>`);

    return new SyntaxToken(kind, this.Current.Position);
  }

  Parse(): SyntaxTree {
    const expression = this.ParseExpression();
    const endOfFileToken = this.Match(SyntaxKind.EndOfFileToken);

    return new SyntaxTree(this.diagnostics, expression, endOfFileToken);
  }

  private ParseExpression(parentPrecedence = 0): ExpressionSyntax {
    let left: ExpressionSyntax;

    const unaryOperatorPrecedence = GetUnaryOperatorPrecedence(this.Current.Kind);

    if (unaryOperatorPrecedence > 0 && unaryOperatorPrecedence >= parentPrecedence) {
      const operatorToken = this.NextToken;
      const operand = this.ParseExpression(unaryOperatorPrecedence);

      left = new UnarySyntax(operatorToken, operand);
    } else {
      left = this.ParsePrimaryExpression();
    }

    while (true) {
      const precedence = GetBinaryOperatorPrecedence(this.Current.Kind);

      if (precedence === 0 || precedence <= parentPrecedence) break;

      const operatorToken = this.NextToken;

      const right = this.ParseExpression(precedence);

      left = new BinarySyntax(left, operatorToken, right);
    }

    return left;
  }

  private ParsePrimaryExpression(): ExpressionSyntax {
    switch (this.Current.Kind) {
      case SyntaxKind.OpenParenthesisToken: {
        const left = this.NextToken;
        const expression = this.ParseExpression();
        const right = this.Match(SyntaxKind.CloseParenthesisToken);

        return new ParenthesisSyntax(left, expression, right);
      }

      case SyntaxKind.FalseKeyword:
      case SyntaxKind.TrueKeyword: {
        const value = this.Current.Kind === SyntaxKind.TrueKeyword;
        const keywordToken = this.NextToken;

        return new LiteralSyntax(keywordToken, value);
      }

      default: {
        const value = this.Current.Value;
        return new LiteralSyntax(this.Match(SyntaxKind.LiteralToken), value);
      }
    }
  }
}

export { Parser };
