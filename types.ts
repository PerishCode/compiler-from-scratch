enum SyntaxKind {
  NumberToken = "Number",
  WhitespaceToken = "Whitespace",
  PlusToken = "Plus",
  MinusToken = "Minus",
  StarToken = "Star",
  SlashToken = "Slash",
  OpenParenthesisToken = "OpenParenthesis",
  CloseParenthesisToken = "CloseParenthesis",
  BadToken = "Bad",
  EndOfFileToken = "EndOfFile",
  NumberExpression = "NumberExpression",
  BinaryExpression = "BinaryExpression",
  ParenthesizedExpression = "ParenthesizedExpression",
}

interface SyntaxNode {
  get Kind(): SyntaxKind;
  Children(): Iterable<SyntaxNode>;
}

interface ExpressionSyntax extends SyntaxNode {}

export { SyntaxKind };

export type { SyntaxNode, ExpressionSyntax };
