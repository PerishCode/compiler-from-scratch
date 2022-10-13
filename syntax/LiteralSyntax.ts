import { SyntaxToken } from "./token.ts";
import { SyntaxKind, SyntaxNode, ExpressionSyntax } from "./types.ts";

export class LiteralSyntax implements ExpressionSyntax {
  readonly Kind: SyntaxKind = SyntaxKind.LiteralExpression;
  readonly LiteralToken: SyntaxToken;

  constructor(literalToken: SyntaxToken) {
    this.LiteralToken = literalToken;
  }

  Children(): Iterable<SyntaxNode> {
    return [this.LiteralToken];
  }
}
