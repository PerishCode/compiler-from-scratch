import * as Colors from "@deno.land/std@0.159.0/fmt/colors.ts";
import { readLines } from "@deno.land/std@0.159.0/io/buffer.ts";
import { Binder } from "@binding/Binder.ts";
import { SyntaxTree } from "@syntax/index.ts";
import { Evaluator } from "./evaluator.ts";
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
        const binder = new Binder();
        const boundExpression = binder.Bind(syntaxTree.Root);
        const diagnostics = syntaxTree.Diagnostics.concat(binder.Diagnostics);

        if (show) SyntaxTree.PrettyPrint(syntaxTree.Root);

        if (diagnostics.length) {
          for (const diagnostic of diagnostics) {
            console.log(Colors.red(diagnostic));
          }
        } else {
          const evaluator = new Evaluator(boundExpression);
          const result = evaluator.Evaluate();
          console.log(result);
        }
      }
    }

    await print("> ");
  }
}

main();
