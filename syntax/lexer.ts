import { SyntaxKind } from "./types.ts";
import { SyntaxToken } from "./token.ts";
import { GetKeywordKind } from "./syntaxRules.ts";

class Lexer {
  private readonly text: string;
  private position: number;
  private diagnostics: string[] = [];

  constructor(text: string) {
    this.text = text;
    this.position = 0;
  }

  private get Current(): string {
    return this.position >= this.text.length ? "\0" : this.text[this.position];
  }

  get Diagnostics(): Iterable<string> {
    return this.diagnostics;
  }

  private Next() {
    return this.position++;
  }

  NextToken(): SyntaxToken {
    // <numbers>
    // + - * / ( )
    // <whitespace>

    if (this.position >= this.text.length) {
      return new SyntaxToken(SyntaxKind.EndOfFileToken, this.position, "\0");
    }

    if (/[0-9]/.test(this.Current)) {
      const start = this.position;

      while (/[0-9]/.test(this.Current)) {
        this.Next();
      }

      const text = this.text.substring(start, this.position);

      const value = parseInt(text);

      if (isNaN(value)) {
        this.diagnostics.push(`The number ${value} cannot be represented by an integer`);
      }

      return new SyntaxToken(SyntaxKind.LiteralToken, start, text, value);
    }

    if (/[a-zA-Z]/.test(this.Current)) {
      const start = this.position;

      while (/[a-zA-Z]/.test(this.Current)) this.Next();

      const text = this.text.substring(start, this.position);
      const kind = GetKeywordKind(text);

      return new SyntaxToken(kind, start, text, null);
    }

    switch (this.Current) {
      case " ": {
        const start = this.position;

        while ((this.Current as string) === " ") {
          this.Next();
        }

        const text = this.text.substring(start, this.position);

        return new SyntaxToken(SyntaxKind.WhitespaceToken, start, text);
      }
      case "+":
        return new SyntaxToken(SyntaxKind.PlusToken, this.Next(), "+");
      case "-":
        return new SyntaxToken(SyntaxKind.MinusToken, this.Next(), "-");
      case "*":
        return new SyntaxToken(SyntaxKind.StarToken, this.Next(), "*");
      case "/":
        return new SyntaxToken(SyntaxKind.SlashToken, this.Next(), "/");
      case "(":
        return new SyntaxToken(SyntaxKind.OpenParenthesisToken, this.Next(), "(");
      case ")":
        return new SyntaxToken(SyntaxKind.CloseParenthesisToken, this.Next(), ")");
      default: {
        this.diagnostics.push(`ERRROR: bad charactor input: ${this.Current} at ${this.position}`);

        return new SyntaxToken(SyntaxKind.BadToken, this.Next(), this.text.substring(this.position - 1));
      }
    }
  }
}

export { Lexer };
