import { Lexer } from "./lexer.ts";
import { SyntaxTree } from "./syntax-tree.ts";
import { SyntaxToken } from "./token.ts";
import { SyntaxKind, SyntaxNode, ExpressionSyntax } from "./types.ts";

class NumberSyntax implements ExpressionSyntax {
  readonly Kind: SyntaxKind = SyntaxKind.NumberExpression;
  readonly NumberToken: SyntaxToken;

  constructor(numberToken: SyntaxToken) {
    this.NumberToken = numberToken;
  }

  Children(): Iterable<SyntaxNode> {
    return [this.NumberToken];
  }
}

class BinarySyntax implements ExpressionSyntax {
  constructor(
    left: ExpressionSyntax,
    operatorToken: SyntaxToken,
    right: ExpressionSyntax
  ) {
    this.Left = left;
    this.OperatorToken = operatorToken;
    this.Right = right;
  }

  readonly Left: ExpressionSyntax;
  readonly OperatorToken: SyntaxToken;
  readonly Right: ExpressionSyntax;

  get Kind(): SyntaxKind {
    return SyntaxKind.BinaryExpression;
  }

  Children(): Iterable<SyntaxNode> {
    return [this.Left, this.OperatorToken, this.Right];
  }
}

class ParenthesisSyntax implements ExpressionSyntax {
  readonly OpenParenthesisToken: SyntaxToken;
  readonly Expression: ExpressionSyntax;
  readonly CloseParenthesisToken: SyntaxToken;

  constructor(
    openParenthesisToken: SyntaxToken,
    expression: ExpressionSyntax,
    closeParenthesisToken: SyntaxToken
  ) {
    this.OpenParenthesisToken = openParenthesisToken;
    this.Expression = expression;
    this.CloseParenthesisToken = closeParenthesisToken;
  }

  get Kind(): SyntaxKind {
    return SyntaxKind.ParenthesizedExpression;
  }

  Children(): Iterable<SyntaxNode> {
    return [
      this.OpenParenthesisToken,
      this.Expression,
      this.CloseParenthesisToken,
    ];
  }
}

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

    return new NumberSyntax(this.Match(SyntaxKind.NumberToken));
  }
}

export { Parser, NumberSyntax, BinarySyntax, ParenthesisSyntax };
