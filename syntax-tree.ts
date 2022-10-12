import { Parser } from "./parser.ts";
import { SyntaxToken } from "./token.ts";
import { ExpressionSyntax } from "./types.ts";

class SyntaxTree {
  readonly Diagnostics: readonly string[];
  readonly Root: ExpressionSyntax;
  readonly EndOfFileToken: SyntaxToken;

  constructor(
    diagnostics: Iterable<string>,
    root: ExpressionSyntax,
    endOfFileToken: SyntaxToken
  ) {
    this.Diagnostics = Array.from(diagnostics);
    this.Root = root;
    this.EndOfFileToken = endOfFileToken;
  }

  static Parse(text: string) {
    const parser = new Parser(text);
    return parser.Parse();
  }
}

export { SyntaxTree };
