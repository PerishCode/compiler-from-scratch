import { SyntaxToken } from "./token.ts";
import { SyntaxKind, SyntaxNode, ExpressionSyntax } from "./types.ts";

export class BinarySyntax implements ExpressionSyntax {
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
