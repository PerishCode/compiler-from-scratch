enum BoundNodeKind {
  UnaryExpression = "UnaryExpression",
  LiteralExpression = "LiteralExpression",
}

enum BoundUnaryOperatorKind {
  Identity = "Identity",
  Negation = "Negation",
}

enum BoundBinaryOperatorKind {
  Addition = "Addition",
  Subtraction = "Subtraction",
  Multiplication = "Multiplication",
  Division = "Division",
}

interface BoundNode {
  get Kind(): BoundNodeKind;
}

interface BoundExpression extends BoundNode {
  get Type(): string;
}

export { BoundNodeKind, BoundUnaryOperatorKind, BoundBinaryOperatorKind };

export type { BoundNode, BoundExpression };
