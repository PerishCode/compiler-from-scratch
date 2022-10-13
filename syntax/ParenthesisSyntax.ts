import { SyntaxToken } from "./token.ts";
import { SyntaxKind, SyntaxNode, ExpressionSyntax } from "./types.ts";

export class ParenthesisSyntax implements ExpressionSyntax {
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
