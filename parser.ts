import { BinarySyntax } from "./BinarySyntax.ts";
import { Lexer } from "./lexer.ts";
import { LiteralSyntax } from "./LiteralSyntax.ts";
import { ParenthesisSyntax } from "./ParenthesisSyntax.ts";
import { SyntaxTree } from "./syntaxTree.ts";
import { SyntaxToken } from "./token.ts";
import { SyntaxKind, ExpressionSyntax } from "./types.ts";

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

    return index >= this.tokens.length
      ? this.tokens[this.tokens.length - 1]
      : this.tokens[index];
  }

  constructor(text: string) {
    const tokens = [];
    const lexer = new Lexer(text);

    let token: SyntaxToken;

    do {
      token = lexer.NextToken();

      if (
        token.Kind !== SyntaxKind.WhitespaceToken &&
        token.Kind !== SyntaxKind.BadToken
      ) {
        tokens.push(token);
      }
    } while (token.Kind != SyntaxKind.EndOfFileToken);

    this.tokens = tokens;
    this.position = 0;
  }

  private Match(kind: SyntaxKind) {
    if (this.Current.Kind === kind) return this.NextToken;

    this.diagnostics.push(
      `ERROR: Unexpected token <${this.Current.Kind}>, expected <${kind}>`
    );

    return new SyntaxToken(kind, this.Current.Position);
  }

  Parse(): SyntaxTree {
    const expression = this.ParseTermExpression();
    const endOfFileToken = this.Match(SyntaxKind.EndOfFileToken);

    return new SyntaxTree(this.diagnostics, expression, endOfFileToken);
  }

  private ParseExpression(): ExpressionSyntax {
    return this.ParseTermExpression();
  }

  private ParseTermExpression(): ExpressionSyntax {
    let left = this.ParseFactorExpression();

    while (
      this.Current.Kind === SyntaxKind.PlusToken ||
      this.Current.Kind === SyntaxKind.MinusToken
    ) {
      const operatorToken = this.NextToken;
      const right = this.ParseFactorExpression();

      left = new BinarySyntax(left, operatorToken, right);
    }

    return left;
  }

  private ParseFactorExpression(): ExpressionSyntax {
    let left = this.ParsePrimaryExpression();

    while (
      this.Current.Kind === SyntaxKind.StarToken ||
      this.Current.Kind === SyntaxKind.SlashToken
    ) {
      const operatorToken = this.NextToken;
      const right = this.ParsePrimaryExpression();

      left = new BinarySyntax(left, operatorToken, right);
    }

    return left;
  }

  private ParsePrimaryExpression(): ExpressionSyntax {
    if (this.Current.Kind === SyntaxKind.OpenParenthesisToken) {
      const left = this.NextToken;
      const expression = this.ParseExpression();
      const right = this.Match(SyntaxKind.CloseParenthesisToken);

      return new ParenthesisSyntax(left, expression, right);
    }

    return new LiteralSyntax(this.Match(SyntaxKind.LiteralToken));
  }
}

export { Parser };
