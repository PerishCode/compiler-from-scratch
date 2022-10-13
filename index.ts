import { readLines } from "@deno.land/std@0.159.0/io/buffer.ts";
import * as Colors from "@deno.land/std@0.159.0/fmt/colors.ts";
import { Evaluator, SyntaxTree } from "@syntax/index.ts";
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

        if (show) SyntaxTree.PrettyPrint(syntaxTree.Root);

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

main();
