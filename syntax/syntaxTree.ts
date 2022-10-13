import { Parser } from "./parser.ts";
import { SyntaxToken } from "./token.ts";
import { ExpressionSyntax, SyntaxNode } from "./types.ts";

class SyntaxTree {
  readonly Diagnostics: readonly string[];
  readonly Root: ExpressionSyntax;
  readonly EndOfFileToken: SyntaxToken;

  constructor(diagnostics: Iterable<string>, root: ExpressionSyntax, endOfFileToken: SyntaxToken) {
    this.Diagnostics = Array.from(diagnostics);
    this.Root = root;
    this.EndOfFileToken = endOfFileToken;
  }

  static Parse(text: string) {
    const parser = new Parser(text);
    return parser.Parse();
  }

  static PrettyPrint(node: SyntaxNode, indent = "", isLast = true) {
    const marker = isLast ? "└" : "├";
    const line = "-".repeat(3);

    if (node instanceof SyntaxToken && node.Value !== undefined && node.Value !== null) {
      console.log([indent, marker, line, node.Kind, " : ", node.Value].join(""));
    } else {
      console.log([indent, marker, line, node.Kind].join(""));
    }

    const children = Array.from(node.Children());

    for (let i = 0; i < children.length; ++i) {
      SyntaxTree.PrettyPrint(children[i], indent + (isLast ? " " : "|") + "   ", i + 1 === children.length);
    }

    // ├ │ └ ─
  }
}

export { SyntaxTree };
