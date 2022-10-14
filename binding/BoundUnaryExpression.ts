import { BoundNodeKind, BoundExpression, BoundUnaryOperatorKind } from "@binding/types.ts";

class BoundUnaryExpression implements BoundExpression {
  readonly OperatorKind: BoundUnaryOperatorKind;
  readonly Operand: BoundExpression;

  get Type(): string {
    return this.Operand.Type;
  }
  get Kind(): BoundNodeKind {
    return this.Operand.Kind;
  }

  constructor(operatorKind: BoundUnaryOperatorKind, operand: BoundExpression) {
    this.OperatorKind = operatorKind;
    this.Operand = operand;
  }
}

export { BoundUnaryExpression };
