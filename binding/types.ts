enum BoundNodeKind {
  UnaryExpression = "UnaryExpression",
  LiteralExpression = "LiteralExpression",
}

enum BoundUnaryOperatorKind {
  Identity = "Identity",
  Negation = "Negation",
  LogicalNegation = "LogicalNegation",
}

enum BoundBinaryOperatorKind {
  Addition = "Addition",
  Subtraction = "Subtraction",
  Multiplication = "Multiplication",
  Division = "Division",
  LogicalAnd = "LogicalAnd",
  LogicalOr = "LogicalOr",
}

interface BoundNode {
  get Kind(): BoundNodeKind;
}

interface BoundExpression extends BoundNode {
  get Type(): string;
}

export { BoundNodeKind, BoundUnaryOperatorKind, BoundBinaryOperatorKind };

export type { BoundNode, BoundExpression };
