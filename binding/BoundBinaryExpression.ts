import { BoundNodeKind, BoundExpression, BoundBinaryOperatorKind } from "@binding/types.ts";

class BoundBinaryExpression implements BoundExpression {
  readonly Left: BoundExpression;
  readonly OperatorKind: BoundBinaryOperatorKind;
  readonly Right: BoundExpression;

  get Type(): string {
    return this.Left.Type;
  }
  get Kind(): BoundNodeKind {
    return this.Left.Kind;
  }

  constructor(left: BoundExpression, operatorKind: BoundBinaryOperatorKind, operand: BoundExpression) {
    this.Left = left;
    this.OperatorKind = operatorKind;
    this.Right = operand;
  }
}

export { BoundBinaryExpression };
