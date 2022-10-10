import { Lexer, SyntaxKind, SyntaxToken } from "./lexer.ts";

interface SyntaxNode {
}

class Parser {
  private readonly tokens: SyntaxToken[];
  private position: number;

  private Peek(offset: number) {
    const index = this.position + offset;

    return index >= this.tokens.length
      ? this.tokens[this.tokens.length - 1]
      : this.tokens[index];
  }

  private get Current() {
    return this.Peek(0);
  }

  constructor(text: string) {
    const tokens = [];
    const lexer = new Lexer(text);

    let token: SyntaxToken;

    do {
      token = lexer.NextToken();

      if (
        token.Kind !== SyntaxKind.WhitespaceToken &&
        token.Kind !== SyntaxKind.BadToken
      ) {
        tokens.push(token);
      }
    } while (token.Kind != SyntaxKind.EndOfFileToken);

    this.tokens = tokens;
    this.position = 0;
  }
}

export { Parser };
