import { SyntaxKind } from "./types.ts";

function GetBinaryOperatorPrecedence(kind: SyntaxKind): number {
  switch (kind) {
    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
      return 1;

    case SyntaxKind.StarToken:
    case SyntaxKind.SlashToken:
      return 2;

    default:
      return 0;
  }
}

function GetUnaryOperatorPrecedence(kind: SyntaxKind): number {
  switch (kind) {
    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
      return 3;

    default:
      return 0;
  }
}

function GetKeywordKind(text: string): SyntaxKind {
  switch (text) {
    case "true":
      return SyntaxKind.TrueKeyword;
    case "false":
      return SyntaxKind.FalseKeyword;

    default:
      return SyntaxKind.IdentifierToken;
  }
}

export { GetBinaryOperatorPrecedence, GetUnaryOperatorPrecedence, GetKeywordKind };
