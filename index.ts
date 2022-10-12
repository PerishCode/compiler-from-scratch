import { readLines } from "@deno.land/std@0.159.0/io/buffer.ts";
import { Evaluator } from "./evaluator.ts";
import { SyntaxTree } from "./syntax-tree.ts";
import { SyntaxToken } from "./token.ts";
import { SyntaxNode } from "./types.ts";

async function main() {
  for await (const line of readLines(Deno.stdin)) {
    const syntaxTree = SyntaxTree.Parse(line);

    PrettyPrint(syntaxTree.Root);

    if (syntaxTree.Diagnostics.length) {
      for (const diagnostic of syntaxTree.Diagnostics) {
        console.log(diagnostic);
      }
    } else {
      const evaluator = new Evaluator(syntaxTree.Root);
      const result = evaluator.Evaluate();
      console.log(result);
    }
  }
}

function PrettyPrint(node: SyntaxNode, indent = "", isLast = true) {
  const marker = isLast ? "└" : "├";
  const line = "-".repeat(3);

  if (
    node instanceof SyntaxToken &&
    node.Value !== undefined &&
    node.Value !== null
  ) {
    console.log([indent, marker, line, node.Kind, " : ", node.Value].join(""));
  } else {
    console.log([indent, marker, line, node.Kind].join(""));
  }

  const children = Array.from(node.Children());

  for (let i = 0; i < children.length; ++i) {
    PrettyPrint(
      children[i],
      indent + (isLast ? " " : "|") + "   ",
      i + 1 === children.length
    );
  }

  // ├ │ └ ─
}

main();
