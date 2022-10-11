import { SyntaxKind, SyntaxNode } from "./types.ts";

class SyntaxToken implements SyntaxNode {
  readonly Kind: SyntaxKind;
  readonly Position: number;
  readonly Text: string;
  readonly Value?: unknown;

  constructor(
    kind: SyntaxKind,
    position: number,
    text: string,
    value?: unknown,
  ) {
    this.Kind = kind;
    this.Position = position;
    this.Text = text;
    this.Value = value;
  }

  Children(): Iterable<SyntaxNode> {
    return [][Symbol.iterator]();
  }
}

class Lexer {
  private readonly text: string;
  private position: number;

  constructor(text: string) {
    this.text = text;
    this.position = 0;
  }

  private get Current(): string {
    return this.position >= this.text.length ? "\0" : this.text[this.position];
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

      return new SyntaxToken(SyntaxKind.NumberToken, start, text, value);
    }

    if (this.Current === " ") {
      const start = this.position;

      while (this.Current === " ") {
        this.Next();
      }

      const text = this.text.substring(start, this.position);

      return new SyntaxToken(SyntaxKind.WhitespaceToken, start, text);
    }

    if (this.Current === "+") {
      return new SyntaxToken(SyntaxKind.PlusToken, this.Next(), "+");
    }

    if (this.Current === "-") {
      return new SyntaxToken(SyntaxKind.MinusToken, this.Next(), "-");
    }

    if (this.Current === "*") {
      return new SyntaxToken(SyntaxKind.StarToken, this.Next(), "*");
    }

    if (this.Current === "/") {
      return new SyntaxToken(SyntaxKind.SlashToken, this.Next(), "/");
    }

    if (this.Current === "(") {
      return new SyntaxToken(SyntaxKind.OpenParenthesisToken, this.Next(), "(");
    }

    if (this.Current === ")") {
      return new SyntaxToken(
        SyntaxKind.CloseParenthesisToken,
        this.Next(),
        ")",
      );
    }

    return new SyntaxToken(
      SyntaxKind.BadToken,
      this.Next(),
      this.text.substring(this.position - 1),
    );
  }
}

export { Lexer, SyntaxToken };
