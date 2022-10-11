import { Lexer, SyntaxToken } from "./lexer.ts";
import { SyntaxKind, SyntaxNode } from "./types.ts";
interface ExpressionSyntax extends SyntaxNode {
}

class NumberSyntax implements ExpressionSyntax {
  readonly Kind: SyntaxKind = SyntaxKind.NumberExpression;
  readonly NumberToken: SyntaxToken;

  constructor(numberToken: SyntaxToken) {
    this.NumberToken = numberToken;
  }

  Children(): Iterable<SyntaxNode> {
    return [this.NumberToken][Symbol.iterator]();
  }
}

class BinarySyntax implements ExpressionSyntax {
  constructor(
    left: ExpressionSyntax,
    operatorToken: SyntaxToken,
    right: ExpressionSyntax,
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
    return [this.Left, this.OperatorToken, this.Right][Symbol.iterator]();
  }
}

class Parser {
  private readonly tokens: SyntaxToken[];
  private position: number;

  private get Current() {
    return this.Peek(0);
  }

  private get NextToken() {
    const current = this.Current;
    this.position++;
    return current;
  }

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

    return new SyntaxToken(kind, this.Current.Position, "");
  }

  Parse(): ExpressionSyntax {
    let left = this.ParsePrimaryExpression();

    while (
      this.Current.Kind === SyntaxKind.PlusToken ||
      this.Current.Kind === SyntaxKind.MinusToken
    ) {
      const operatorToken = this.NextToken;
      const right = this.ParsePrimaryExpression();

      left = new BinarySyntax(left, operatorToken, right);
    }

    return left;
  }

  ParsePrimaryExpression(): ExpressionSyntax {
    return new NumberSyntax(this.Match(SyntaxKind.NumberToken));
  }
}

export { Parser };
