import { ParenthesisSyntax } from "./ParenthesisSyntax.ts";
import { BinarySyntax } from "./BinarySyntax.ts";
import { LiteralSyntax } from "./LiteralSyntax.ts";
import { ExpressionSyntax, SyntaxKind } from "./types.ts";
import { UnarySyntax } from "./UnarySyntax.ts";

class Evaluator {
  private readonly root: ExpressionSyntax;

  constructor(root: ExpressionSyntax) {
    this.root = root;
  }

  Evaluate() {
    return this.EvaluateExpression(this.root);
  }

  private EvaluateExpression(node: ExpressionSyntax): number {
    if (node instanceof LiteralSyntax) {
      return node.LiteralToken.Value as number;
    }

    if (node instanceof UnarySyntax) {
      const operand = this.EvaluateExpression(node.Operand);

      switch (node.OperatorToken.Kind) {
        case SyntaxKind.PlusToken:
          return operand;
        case SyntaxKind.MinusToken:
          return -operand;
        default:
          throw new Error(
            `Unexpected unary operator ${node.OperatorToken.Kind}`
          );
      }
    }

    if (node instanceof BinarySyntax) {
      const left = this.EvaluateExpression(node.Left);
      const right = this.EvaluateExpression(node.Right);

      switch (node.OperatorToken.Kind) {
        case SyntaxKind.PlusToken:
          return left + right;
        case SyntaxKind.MinusToken:
          return left - right;
        case SyntaxKind.StarToken:
          return left * right;
        case SyntaxKind.SlashToken:
          return left / right;
        default:
          throw new Error(
            `Unexpected binary operator ${node.OperatorToken.Kind}`
          );
      }
    }

    if (node instanceof ParenthesisSyntax) {
      return this.EvaluateExpression(node.Expression);
    }

    throw new Error(`Unexpected Node ${node.Kind}`);
  }
}

export { Evaluator };
