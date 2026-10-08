import { Decimal } from "../decimal/decimal.ts";
import type { Token } from "../types/tokens.ts";
import { OPERATOR_METADATA } from "../types/tokens.ts";

export type ASTNode =
  | { type: "number"; value: Decimal }
  | { type: "constant"; name: string }
  | { type: "unary"; operator: "-"; operand: ASTNode }
  | { type: "percent"; operand: ASTNode }
  | { type: "factorial"; operand: ASTNode }
  | { type: "function"; name: string; args: ASTNode[] }
  | { type: "binary"; operator: string; left: ASTNode; right: ASTNode };

export class ParserError extends Error {
  public readonly code: "SYNTAX_ERROR" | "UNCLOSED_PARENTHESES";
  public readonly position?: number;

  constructor(message: string, code: "SYNTAX_ERROR" | "UNCLOSED_PARENTHESES" = "SYNTAX_ERROR", position?: number) {
    super(message);
    this.name = "ParserError";
    this.code = code;
    this.position = position;
  }
}

type RpnItem =
  | Token
  | { kind: "RPN_OP"; symbol: string; position: number }
  | { kind: "RPN_FUNC"; name: string; argCount: number; position: number };

/**
 * Shunting-Yard Parser constructing an Abstract Syntax Tree (AST) from token streams.
 * Enforces operator precedence, auto-balances parentheses, and handles scientific functions and constants.
 */
export class Parser {
  private readonly tokens: Token[];
  private readonly autoBalance: boolean;

  constructor(tokens: Token[], autoBalance: boolean = false) {
    this.tokens = tokens;
    this.autoBalance = autoBalance;
  }

  public parse(): ASTNode {
    const normalizedTokens = this.normalizeTokens(this.tokens);

    if (normalizedTokens.length === 0) {
      return { type: "number", value: Decimal.ZERO };
    }

    const outputQueue: RpnItem[] = [];
    const operatorStack: Token[] = [];
    // Track argument count for active functions on stack
    const functionArgCountStack: number[] = [];

    for (const token of normalizedTokens) {
      if (token.kind === "NUMBER" || token.kind === "CONSTANT") {
        outputQueue.push(token);
      } else if (token.kind === "FUNCTION") {
        operatorStack.push(token);
        functionArgCountStack.push(1);
      } else if (token.kind === "COMMA") {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].kind !== "LPAREN") {
          const popped = operatorStack.pop()!;
          outputQueue.push({
            kind: "RPN_OP",
            symbol: popped.kind === "UNARY_MINUS" ? "u-" : popped.value,
            position: popped.position,
          });
        }
        if (operatorStack.length === 0) {
          throw new ParserError("Misplaced comma in expression", "SYNTAX_ERROR", token.position);
        }
        if (functionArgCountStack.length > 0) {
          functionArgCountStack[functionArgCountStack.length - 1]++;
        }
      } else if (token.kind === "PERCENT") {
        outputQueue.push({ kind: "RPN_OP", symbol: "%", position: token.position });
      } else if (token.kind === "FACTORIAL") {
        outputQueue.push({ kind: "RPN_OP", symbol: "!", position: token.position });
      } else if (token.kind === "UNARY_MINUS") {
        operatorStack.push(token);
      } else if (token.kind === "OPERATOR") {
        const op1Meta = OPERATOR_METADATA[token.value] || { precedence: 1, associativity: "left" };

        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.kind === "LPAREN") break;

          const topSymbol = top.kind === "UNARY_MINUS" ? "u-" : top.value;
          const topMeta = OPERATOR_METADATA[topSymbol] || { precedence: 1, associativity: "left" };

          if (
            (op1Meta.associativity === "left" && op1Meta.precedence <= topMeta.precedence) ||
            (op1Meta.associativity === "right" && op1Meta.precedence < topMeta.precedence)
          ) {
            const popped = operatorStack.pop()!;
            outputQueue.push({
              kind: "RPN_OP",
              symbol: popped.kind === "UNARY_MINUS" ? "u-" : popped.value,
              position: popped.position,
            });
          } else {
            break;
          }
        }
        operatorStack.push(token);
      } else if (token.kind === "LPAREN") {
        operatorStack.push(token);
      } else if (token.kind === "RPAREN") {
        let foundLparen = false;
        while (operatorStack.length > 0) {
          const popped = operatorStack.pop()!;
          if (popped.kind === "LPAREN") {
            foundLparen = true;
            break;
          }
          outputQueue.push({
            kind: "RPN_OP",
            symbol: popped.kind === "UNARY_MINUS" ? "u-" : popped.value,
            position: popped.position,
          });
        }
        if (!foundLparen) {
          throw new ParserError("Mismatched closing parenthesis", "SYNTAX_ERROR", token.position);
        }

        // If top of stack is a function, pop it to output queue
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].kind === "FUNCTION") {
          const fnToken = operatorStack.pop()!;
          const argCount = functionArgCountStack.pop() || 1;
          outputQueue.push({
            kind: "RPN_FUNC",
            name: fnToken.value,
            argCount,
            position: fnToken.position,
          });
        }
      }
    }

    while (operatorStack.length > 0) {
      const popped = operatorStack.pop()!;
      if (popped.kind === "LPAREN") {
        if (!this.autoBalance) {
          throw new ParserError("Unclosed parenthesis in expression", "UNCLOSED_PARENTHESES", popped.position);
        }
        continue;
      }
      if (popped.kind === "FUNCTION") {
        const argCount = functionArgCountStack.pop() || 1;
        outputQueue.push({
          kind: "RPN_FUNC",
          name: popped.value,
          argCount,
          position: popped.position,
        });
        continue;
      }
      outputQueue.push({
        kind: "RPN_OP",
        symbol: popped.kind === "UNARY_MINUS" ? "u-" : popped.value,
        position: popped.position,
      });
    }

    // Build AST from RPN output queue
    const nodeStack: ASTNode[] = [];

    for (const item of outputQueue) {
      if (item.kind === "NUMBER") {
        nodeStack.push({
          type: "number",
          value: Decimal.fromString(item.value),
        });
      } else if (item.kind === "CONSTANT") {
        nodeStack.push({
          type: "constant",
          name: item.value,
        });
      } else if (item.kind === "RPN_FUNC") {
        const args: ASTNode[] = [];
        for (let i = 0; i < item.argCount; i++) {
          const arg = nodeStack.pop();
          if (!arg) {
            throw new ParserError(`Function "${item.name}" missing arguments`, "SYNTAX_ERROR", item.position);
          }
          args.unshift(arg);
        }
        nodeStack.push({
          type: "function",
          name: item.name,
          args,
        });
      } else if (item.kind === "RPN_OP") {
        if (item.symbol === "u-") {
          const operand = nodeStack.pop();
          if (!operand) {
            throw new ParserError("Unary minus missing operand", "SYNTAX_ERROR", item.position);
          }
          nodeStack.push({
            type: "unary",
            operator: "-",
            operand,
          });
        } else if (item.symbol === "%") {
          const operand = nodeStack.pop();
          if (!operand) {
            throw new ParserError("Percentage operator missing operand", "SYNTAX_ERROR", item.position);
          }
          nodeStack.push({
            type: "percent",
            operand,
          });
        } else if (item.symbol === "!") {
          const operand = nodeStack.pop();
          if (!operand) {
            throw new ParserError("Factorial operator missing operand", "SYNTAX_ERROR", item.position);
          }
          nodeStack.push({
            type: "factorial",
            operand,
          });
        } else {
          // Binary operator (+, -, *, /, ^, mod, nCr, nPr)
          const right = nodeStack.pop();
          const left = nodeStack.pop();
          if (!left || !right) {
            throw new ParserError(`Operator "${item.symbol}" missing operands`, "SYNTAX_ERROR", item.position);
          }
          nodeStack.push({
            type: "binary",
            operator: item.symbol,
            left,
            right,
          });
        }
      }
    }

    if (nodeStack.length !== 1) {
      throw new ParserError("Malformed expression", "SYNTAX_ERROR");
    }

    return nodeStack[0];
  }

  /**
   * Pre-processes tokens:
   * 1. Replaces consecutive binary operators with the latest (RULE-STD-02).
   * 2. Auto-balances unclosed parentheses if autoBalance is enabled (RULE-STD-01, CASE-STD-04).
   * 3. Drops trailing dangling operators before parsing if needed.
   */
  private normalizeTokens(rawTokens: Token[]): Token[] {
    let tokens: Token[] = [];

    for (let i = 0; i < rawTokens.length; i++) {
      const current = rawTokens[i];
      if (current.kind === "OPERATOR") {
        const next = i + 1 < rawTokens.length ? rawTokens[i + 1] : null;
        if (next && next.kind === "OPERATOR") {
          continue;
        }
      }
      tokens.push(current);
    }

    // Drop trailing binary operator if expression ended with one during auto-balance
    if (this.autoBalance && tokens.length > 0) {
      while (
        tokens.length > 0 &&
        (tokens[tokens.length - 1].kind === "OPERATOR" ||
          tokens[tokens.length - 1].kind === "UNARY_MINUS" ||
          tokens[tokens.length - 1].kind === "COMMA")
      ) {
        tokens.pop();
      }
    }

    // Auto-balance unclosed parentheses on commit
    if (this.autoBalance) {
      let openCount = 0;
      let closeCount = 0;
      for (const t of tokens) {
        if (t.kind === "LPAREN") openCount++;
        if (t.kind === "RPAREN") closeCount++;
      }

      if (openCount > closeCount) {
        const diff = openCount - closeCount;
        for (let i = 0; i < diff; i++) {
          tokens.push({
            kind: "RPAREN",
            value: ")",
            position: tokens.length > 0 ? tokens[tokens.length - 1].position + 1 : 0,
          });
        }
      }
    }

    return tokens;
  }
}
