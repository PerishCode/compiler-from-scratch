import { SyntaxToken } from "./token.ts";
import { SyntaxKind, SyntaxNode, ExpressionSyntax } from "./types.ts";

export class UnarySyntax implements ExpressionSyntax {
  constructor(operatorToken: SyntaxToken, operand: ExpressionSyntax) {
    this.OperatorToken = operatorToken;
    this.Operand = operand;
  }

  readonly OperatorToken: SyntaxToken;
  readonly Operand: ExpressionSyntax;

  get Kind(): SyntaxKind {
    return SyntaxKind.UnaryExpression;
  }

  Children(): Iterable<SyntaxNode> {
    return [this.OperatorToken, this.Operand];
  }
}
