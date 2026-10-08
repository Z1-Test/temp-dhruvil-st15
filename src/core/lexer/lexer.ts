import type { Token, TokenKind } from "../types/tokens.ts";

export class LexerError extends Error {
  public readonly position: number;

  constructor(message: string, position: number) {
    super(`${message} at position ${position}`);
    this.name = "LexerError";
    this.position = position;
  }
}

/**
 * Tokenizes mathematical expression strings into typed tokens.
 */
export class Lexer {
  private readonly input: string;
  private pos: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    this.pos = 0;

    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];

      // Skip whitespace
      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }

      // Numbers (including decimals like .5 or 12.5)
      if (this.isDigit(ch) || (ch === "." && this.isDigit(this.peek(1)))) {
        tokens.push(this.readNumber());
        continue;
      }

      // Operators
      if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "×" || ch === "÷") {
        const startPos = this.pos;
        this.pos++;

        // Determine if minus is binary or unary
        if (ch === "-") {
          const prevToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
          const isUnary =
            !prevToken ||
            prevToken.kind === "OPERATOR" ||
            prevToken.kind === "UNARY_MINUS" ||
            prevToken.kind === "LPAREN";

          if (isUnary) {
            tokens.push({
              kind: "UNARY_MINUS",
              value: "-",
              position: startPos,
            });
            continue;
          }
        }

        // Normalize symbols: × -> *, ÷ -> /
        let normalized = ch;
        if (ch === "×") normalized = "*";
        if (ch === "÷") normalized = "/";

        tokens.push({
          kind: "OPERATOR",
          value: normalized,
          position: startPos,
        });
        continue;
      }

      // Percentage
      if (ch === "%") {
        tokens.push({
          kind: "PERCENT",
          value: "%",
          position: this.pos,
        });
        this.pos++;
        continue;
      }

      // Parentheses
      if (ch === "(") {
        tokens.push({
          kind: "LPAREN",
          value: "(",
          position: this.pos,
        });
        this.pos++;
        continue;
      }

      if (ch === ")") {
        tokens.push({
          kind: "RPAREN",
          value: ")",
          position: this.pos,
        });
        this.pos++;
        continue;
      }

      throw new LexerError(`Unexpected character "${ch}"`, this.pos);
    }

    return tokens;
  }

  private isDigit(ch: string | undefined): boolean {
    return ch !== undefined && ch >= "0" && ch <= "9";
  }

  private peek(offset: number = 0): string | undefined {
    return this.input[this.pos + offset];
  }

  private readNumber(): Token {
    const start = this.pos;
    let hasDot = false;

    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (this.isDigit(ch)) {
        this.pos++;
      } else if (ch === ".") {
        if (hasDot) {
          // Double decimal point encountered in numeric literal
          break;
        }
        hasDot = true;
        this.pos++;
      } else {
        break;
      }
    }

    const value = this.input.slice(start, this.pos);
    return {
      kind: "NUMBER",
      value,
      position: start,
    };
  }
}
