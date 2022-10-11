import { Lexer, SyntaxToken } from "./lexer.ts";
import { Parser } from "./parser.ts";
import { SyntaxKind, SyntaxNode } from "./types.ts";

function main() {
  // const lexer = new Lexer("1 * 2 + 3");

  // while (true) {
  //   const token = lexer.NextToken();

  //   if (token.Kind === SyntaxKind.EndOfFileToken) {
  //     break;
  //   }

  //   console.log(token.Position, token.Text, token.Kind, token.Value);
  // }

  const parser = new Parser("1 + 1 - 2");

  const expression = parser.Parse();

  PrettyPrint(expression);
}

function PrettyPrint(
  node: SyntaxNode,
  depth = 0,
  isLast = false,
) {
  const marker = isLast ? "└" : "├";
  const line = "-".repeat(3);
  const indent = "|   ".repeat(depth);

  if (
    node instanceof SyntaxToken && node.Value !== undefined &&
    node.Value !== null
  ) {
    console.log([indent, marker, line, node.Kind, node.Value].join(""));
  } else {
    console.log([indent, marker, line, node.Kind].join(""));
  }

  const children = Array.from(node.Children());

  for (let i = 0; i < children.length; ++i) {
    PrettyPrint(children[i], depth + 1, i + 1 === children.length);
  }

  // ├ │ └ ─
}

main();
