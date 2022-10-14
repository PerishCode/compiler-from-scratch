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

  private EvaluateExpression(node: BoundExpression): unknown {
    if (node instanceof BoundLiteralExpression) {
      return node.Value;
    }

    if (node instanceof BoundUnaryExpression) {
      const operand = this.EvaluateExpression(node.Operand);

      switch (node.OperatorKind) {
        case BoundUnaryOperatorKind.Identity:
          return operand as number;
        case BoundUnaryOperatorKind.Negation:
          return -(operand as number);
        case BoundUnaryOperatorKind.LogicalNegation:
          return !(operand as boolean);
        default:
          throw new Error(`Unexpected unary operator ${node.OperatorKind}`);
      }
    }

    if (node instanceof BoundBinaryExpression) {
      const left = this.EvaluateExpression(node.Left);
      const right = this.EvaluateExpression(node.Right);

      switch (node.OperatorKind) {
        case BoundBinaryOperatorKind.Addition:
          return (left as number) + (right as number);
        case BoundBinaryOperatorKind.Subtraction:
          return (left as number) - (right as number);
        case BoundBinaryOperatorKind.Multiplication:
          return (left as number) * (right as number);
        case BoundBinaryOperatorKind.Division:
          return (left as number) / (right as number);
        case BoundBinaryOperatorKind.LogicalAnd:
          return (left as boolean) && (right as boolean);
        case BoundBinaryOperatorKind.LogicalOr:
          return (left as boolean) || (right as boolean);
        default:
          throw new Error(`Unexpected binary operator ${node.OperatorKind}`);
      }
    }

    throw new Error(`Unexpected Node ${node.Kind}`);
  }
}

export { Evaluator };
