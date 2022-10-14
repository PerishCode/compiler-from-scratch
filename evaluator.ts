import {
  BoundBinaryExpression,
  BoundBinaryOperatorKind,
  BoundExpression,
  BoundLiteralExpression,
  BoundUnaryExpression,
  BoundUnaryOperatorKind,
} from "@binding/index.ts";

class Evaluator {
  private readonly root: BoundExpression;

  constructor(root: BoundExpression) {
    this.root = root;
  }

  Evaluate() {
    return this.EvaluateExpression(this.root);
  }

  private EvaluateExpression(node: BoundExpression): number {
    if (node instanceof BoundLiteralExpression) {
      return node.Value as number;
    }

    if (node instanceof BoundUnaryExpression) {
      const operand = this.EvaluateExpression(node.Operand);

      switch (node.OperatorKind) {
        case BoundUnaryOperatorKind.Identity:
          return operand;
        case BoundUnaryOperatorKind.Negation:
          return -operand;
        default:
          throw new Error(`Unexpected unary operator ${node.OperatorKind}`);
      }
    }

    if (node instanceof BoundBinaryExpression) {
      const left = this.EvaluateExpression(node.Left);
      const right = this.EvaluateExpression(node.Right);

      switch (node.OperatorKind) {
        case BoundBinaryOperatorKind.Addition:
          return left + right;
        case BoundBinaryOperatorKind.Subtraction:
          return left - right;
        case BoundBinaryOperatorKind.Multiplication:
          return left * right;
        case BoundBinaryOperatorKind.Division:
          return left / right;
        default:
          throw new Error(`Unexpected binary operator ${node.OperatorKind}`);
      }
    }

    throw new Error(`Unexpected Node ${node.Kind}`);
  }
}

export { Evaluator };
