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

function PrettyPrint(node: SyntaxNode, indent = "") {
  if (
    node instanceof SyntaxToken && node.Value !== undefined &&
    node.Value !== null
  ) {
    console.log(indent, node.Kind, node.Value);
  } else {
    console.log(indent, node.Kind);
  }

  for (const child of node.Children()) {
    PrettyPrint(child, indent + "    ");
  }
}

main();
