import { ParenthesisSyntax } from "./ParenthesisSyntax.ts";
import { BinarySyntax } from "./BinarySyntax.ts";
import { NumberSyntax } from "./NumberSyntax.ts";
import { ExpressionSyntax, SyntaxKind } from "./types.ts";

class Evaluator {
  private readonly root: ExpressionSyntax;

  constructor(root: ExpressionSyntax) {
    this.root = root;
  }

  Evaluate() {
    return this.EvaluateExpression(this.root);
  }

  private EvaluateExpression(node: ExpressionSyntax): number {
    if (node instanceof NumberSyntax) {
      return node.NumberToken.Value as number;
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
