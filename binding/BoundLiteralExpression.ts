import { BoundNodeKind, BoundExpression } from "@binding/types.ts";

class BoundLiteralExpression implements BoundExpression {
  readonly Value?: unknown;

  get Type(): string {
    return typeof this.Value;
  }
  get Kind(): BoundNodeKind {
    return BoundNodeKind.LiteralExpression;
  }

  constructor(value?: unknown) {
    this.Value = value;
  }
}

export { BoundLiteralExpression };
