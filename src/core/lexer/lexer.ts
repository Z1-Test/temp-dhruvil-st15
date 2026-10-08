import type { Token, TokenKind } from "../types/tokens.ts";

export class LexerError extends Error {
  public readonly position: number;

  constructor(message: string, position: number) {
    super(`${message} at position ${position}`);
    this.name = "LexerError";
    this.position = position;
  }
}

const SCIENTIFIC_FUNCTIONS = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "asinh",
  "acosh",
  "atanh",
  "csc",
  "sec",
  "cot",
  "acsc",
  "asec",
  "acot",
  "ln",
  "log",
  "log10",
  "log2",
  "sqrt",
  "cbrt",
  "exp",
  "abs",
  "fact",
]);

/**
 * Tokenizes mathematical expression strings into typed tokens.
 * Supports standard arithmetic, scientific functions, trigonometry, combinatorial operators, and constants.
 */
export class Lexer {
  private readonly input: string;
  private pos: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  public tokenize(): Token[] {
    const rawTokens: Token[] = [];
    this.pos = 0;

    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];

      // Skip whitespace
      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }

      // Numbers (including decimals like .5 or 12.5 and scientific exponents e.g. 1e10)
      if (this.isDigit(ch) || (ch === "." && this.isDigit(this.peek(1)))) {
        rawTokens.push(this.readNumber());
        continue;
      }

      // Constants represented by special unicode characters
      if (ch === "π" || ch === "Π") {
        rawTokens.push({ kind: "CONSTANT", value: "pi", position: this.pos });
        this.pos++;
        continue;
      }
      if (ch === "ϕ" || ch === "Φ") {
        rawTokens.push({ kind: "CONSTANT", value: "phi", position: this.pos });
        this.pos++;
        continue;
      }

      // Word identifiers: functions, constants, or text operators (nCr, nPr, mod, etc.)
      if (this.isAlpha(ch)) {
        const identToken = this.readIdentifier(rawTokens);
        rawTokens.push(identToken);
        continue;
      }

      // Power operator ^
      if (ch === "^") {
        rawTokens.push({ kind: "OPERATOR", value: "^", position: this.pos });
        this.pos++;
        continue;
      }

      // Factorial operator !
      if (ch === "!") {
        rawTokens.push({ kind: "FACTORIAL", value: "!", position: this.pos });
        this.pos++;
        continue;
      }

      // Comma separator
      if (ch === ",") {
        rawTokens.push({ kind: "COMMA", value: ",", position: this.pos });
        this.pos++;
        continue;
      }

      // Operators (+, -, *, /, ×, ÷)
      if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "×" || ch === "÷") {
        const startPos = this.pos;
        this.pos++;

        // Determine if minus is binary or unary
        if (ch === "-") {
          const prevToken = rawTokens.length > 0 ? rawTokens[rawTokens.length - 1] : null;
          const isUnary =
            !prevToken ||
            prevToken.kind === "OPERATOR" ||
            prevToken.kind === "UNARY_MINUS" ||
            prevToken.kind === "LPAREN" ||
            prevToken.kind === "COMMA";

          if (isUnary) {
            rawTokens.push({
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

        rawTokens.push({
          kind: "OPERATOR",
          value: normalized,
          position: startPos,
        });
        continue;
      }

      // Percentage
      if (ch === "%") {
        rawTokens.push({
          kind: "PERCENT",
          value: "%",
          position: this.pos,
        });
        this.pos++;
        continue;
      }

      // Parentheses
      if (ch === "(") {
        rawTokens.push({
          kind: "LPAREN",
          value: "(",
          position: this.pos,
        });
        this.pos++;
        continue;
      }

      if (ch === ")") {
        rawTokens.push({
          kind: "RPAREN",
          value: ")",
          position: this.pos,
        });
        this.pos++;
        continue;
      }

      throw new LexerError(`Unexpected character "${ch}"`, this.pos);
    }

    // Insert implicit multiplication where appropriate (e.g. 2π -> 2 * π, 2(3) -> 2 * (3))
    return this.insertImplicitMultiplications(rawTokens);
  }

  private isDigit(ch: string | undefined): boolean {
    return ch !== undefined && ch >= "0" && ch <= "9";
  }

  private isAlpha(ch: string | undefined): boolean {
    return ch !== undefined && /^[a-zA-Z]$/.test(ch);
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

  private readIdentifier(tokens: Token[]): Token {
    const start = this.pos;
    while (this.pos < this.input.length && (this.isAlpha(this.input[this.pos]) || this.isDigit(this.input[this.pos]))) {
      this.pos++;
    }

    const name = this.input.slice(start, this.pos);
    const lower = name.toLowerCase();

    // Check constants
    if (lower === "pi") {
      return { kind: "CONSTANT", value: "pi", position: start };
    }
    if (lower === "phi") {
      return { kind: "CONSTANT", value: "phi", position: start };
    }
    if (lower === "e") {
      // Single 'e' is Euler's constant
      return { kind: "CONSTANT", value: "e", position: start };
    }

    // Check binary operators
    if (lower === "ncr") {
      return { kind: "OPERATOR", value: "nCr", position: start };
    }
    if (lower === "npr") {
      return { kind: "OPERATOR", value: "nPr", position: start };
    }
    if (lower === "mod") {
      return { kind: "OPERATOR", value: "mod", position: start };
    }


    // Check functions
    if (SCIENTIFIC_FUNCTIONS.has(lower)) {
      return { kind: "FUNCTION", value: lower, position: start };
    }

    throw new LexerError(`Unknown identifier "${name}"`, start);
  }

  private insertImplicitMultiplications(tokens: Token[]): Token[] {
    const result: Token[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const current = tokens[i];
      result.push(current);

      if (i + 1 < tokens.length) {
        const next = tokens[i + 1];

        const isLeftOperand =
          current.kind === "NUMBER" ||
          current.kind === "CONSTANT" ||
          current.kind === "RPAREN" ||
          current.kind === "PERCENT" ||
          current.kind === "FACTORIAL";

        const isRightOperand =
          next.kind === "NUMBER" ||
          next.kind === "CONSTANT" ||
          next.kind === "FUNCTION" ||
          next.kind === "LPAREN";

        if (isLeftOperand && isRightOperand) {
          result.push({
            kind: "OPERATOR",
            value: "*",
            position: current.position + current.value.length,
          });
        }
      }
    }

    return result;
  }
}
