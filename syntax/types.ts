enum SyntaxKind {
  LiteralToken = "LiteralToken",
  WhitespaceToken = "WhitespaceToken",
  PlusToken = "PlusToken",
  MinusToken = "MinusToken",
  StarToken = "StarToken",
  SlashToken = "SlashToken",
  OpenParenthesisToken = "OpenParenthesisToken",
  CloseParenthesisToken = "CloseParenthesisToken",
  BadToken = "BadToken",
  EndOfFileToken = "EndOfFileToken",
  NumberExpression = "NumberExpression",
  BinaryExpression = "BinaryExpression",
  ParenthesizedExpression = "ParenthesizedExpression",
  LiteralExpression = "LiteralExpression",
  UnaryExpression = "UnaryExpression",
  TrueKeyword = "TrueKeyword",
  FalseKeyword = "FalseKeyword",
  IdentifierToken = "IdentifierToken",
  BangToken = "BangToken",
  AndAndToken = "AndAndToken",
  PipePipeToken = "PipePipeToken",
}

interface SyntaxNode {
  get Kind(): SyntaxKind;
  Children(): Iterable<SyntaxNode>;
}

interface ExpressionSyntax extends SyntaxNode {}

export { SyntaxKind };

export type { SyntaxNode, ExpressionSyntax };
