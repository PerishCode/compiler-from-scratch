import { SyntaxToken } from "./token.ts";
import { SyntaxKind, SyntaxNode, ExpressionSyntax } from "./types.ts";

export class NumberSyntax implements ExpressionSyntax {
  readonly Kind: SyntaxKind = SyntaxKind.NumberExpression;
  readonly NumberToken: SyntaxToken;

  constructor(numberToken: SyntaxToken) {
    this.NumberToken = numberToken;
  }

  Children(): Iterable<SyntaxNode> {
    return [this.NumberToken];
  }
}
