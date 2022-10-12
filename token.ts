import { SyntaxKind, SyntaxNode } from "./types.ts";

class SyntaxToken implements SyntaxNode {
  readonly Kind: SyntaxKind;
  readonly Position: number;
  readonly Text: string | null;
  readonly Value?: unknown;

  constructor(
    kind: SyntaxKind,
    position: number,
    text: string | null = null,
    value?: unknown
  ) {
    this.Kind = kind;
    this.Position = position;
    this.Text = text;
    this.Value = value;
  }

  Children(): Iterable<SyntaxNode> {
    return [];
  }
}

export { SyntaxToken };
