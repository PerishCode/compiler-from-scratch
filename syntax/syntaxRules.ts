import { SyntaxKind } from "@syntax/types.ts";

function GetBinaryOperatorPrecedence(kind: SyntaxKind): number {
  switch (kind) {
    case SyntaxKind.StarToken:
    case SyntaxKind.SlashToken:
      return 4;

    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
      return 3;

    case SyntaxKind.AndAndToken:
      return 2;

    case SyntaxKind.PipePipeToken:
      return 1;

    default:
      return 0;
  }
}

function GetUnaryOperatorPrecedence(kind: SyntaxKind): number {
  switch (kind) {
    case SyntaxKind.BangToken:
    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
      return 5;

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
