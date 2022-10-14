import { SyntaxToken } from "@syntax/token.ts";
import { SyntaxKind, SyntaxNode, ExpressionSyntax } from "@syntax/types.ts";

export class LiteralSyntax implements ExpressionSyntax {
  readonly Kind: SyntaxKind = SyntaxKind.LiteralExpression;
  readonly LiteralToken: SyntaxToken;

  readonly Value?: unknown;

  constructor(literalToken: SyntaxToken, value?: unknown) {
    this.LiteralToken = literalToken;
    this.Value = value;
  }

  Children(): Iterable<SyntaxNode> {
    return [this.LiteralToken];
  }
}
