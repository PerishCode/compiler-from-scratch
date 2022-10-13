import { readLines } from "@deno.land/std@0.159.0/io/buffer.ts";
import * as Colors from "@deno.land/std@0.159.0/fmt/colors.ts";
import { Evaluator } from "./evaluator.ts";
import { SyntaxTree } from "./syntaxTree.ts";
import { SyntaxToken } from "./token.ts";
import { SyntaxNode } from "./types.ts";
import { print, println } from "./utils.ts";

async function main() {
  let show = false;

  await print("> ");
  for await (const line of readLines(Deno.stdin)) {
    switch (line) {
      case "#show": {
        show = !show;
        println(Colors.green(`show is ${show ? "on" : "off"}`));
        break;
      }

      case "#quit": {
        return Deno.exit(0);
      }

      default: {
        const syntaxTree = SyntaxTree.Parse(line);

        if (show) PrettyPrint(syntaxTree.Root);

        if (syntaxTree.Diagnostics.length) {
          for (const diagnostic of syntaxTree.Diagnostics) {
            console.log(Colors.red(diagnostic));
          }
        } else {
          const evaluator = new Evaluator(syntaxTree.Root);
          const result = evaluator.Evaluate();
          console.log(result);
        }
      }
    }

    await print("> ");
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
