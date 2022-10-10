import { Lexer, SyntaxKind } from "./lexer.ts";

const lexer = new Lexer("1 * 2 + 3");

while (true) {
  const token = lexer.NextToken();

  if (token.Kind === SyntaxKind.EndOfFileToken) {
    break;
  }

  console.log(token.Position, token.Text, token.Kind, token.Value);
}
