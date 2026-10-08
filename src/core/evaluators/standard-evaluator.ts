import { Decimal, DivisionByZeroError } from "../decimal/decimal.ts";
import { Lexer, LexerError } from "../lexer/lexer.ts";
import { Parser, ParserError } from "../parser/parser.ts";
import type { ASTNode } from "../parser/parser.ts";
import type { CalculationResult } from "../types/result.ts";

export interface EvaluationOptions {
  autoBalance?: boolean;
}

/**
 * Standard Arithmetic Evaluator conforming to Hexagonal Architecture.
 * Evaluates mathematical expressions using arbitrary-precision Decimals without IEEE-754 drift.
 */
export class StandardEvaluator {
  public static evaluate(expression: string, options: EvaluationOptions = {}): CalculationResult {
    const trimmed = expression.trim();
    if (!trimmed) {
      return {
        success: true,
        value: "0",
        formatted: "0",
      };
    }

    try {
      const lexer = new Lexer(trimmed);
      const tokens = lexer.tokenize();

      if (tokens.length === 0) {
        return {
          success: true,
          value: "0",
          formatted: "0",
        };
      }

      const parser = new Parser(tokens, options.autoBalance ?? false);
      const ast = parser.parse();

      const resultDec = this.evaluateNode(ast);
      return {
        success: true,
        value: resultDec.toString(),
        formatted: resultDec.toFormattedString(),
      };
    } catch (err: unknown) {
      if (err instanceof DivisionByZeroError) {
        return {
          success: false,
          error: {
            code: "DIVIDE_BY_ZERO",
            message: "Cannot divide by zero",
          },
        };
      }

      if (err instanceof ParserError) {
        return {
          success: false,
          error: {
            code: err.code,
            message: err.message,
            position: err.position,
          },
        };
      }

      if (err instanceof LexerError) {
        return {
          success: false,
          error: {
            code: "SYNTAX_ERROR",
            message: err.message,
            position: err.position,
          },
        };
      }

      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: {
          code: "SYNTAX_ERROR",
          message: msg,
        },
      };
    }
  }

  private static evaluateNode(node: ASTNode): Decimal {
    switch (node.type) {
      case "number":
        return node.value;

      case "unary": {
        const val = this.evaluateNode(node.operand);
        return val.negate();
      }

      case "percent": {
        const val = this.evaluateNode(node.operand);
        return val.divide(new Decimal(100n, 0));
      }

      case "binary": {
        // Special percentage markup/discount handling (e.g. 200 + 15% -> 230)
        if (node.right.type === "percent") {
          const leftVal = this.evaluateNode(node.left);
          const percentOperand = this.evaluateNode(node.right.operand);

          if (node.operator === "+") {
            const markup = leftVal.multiply(percentOperand).divide(new Decimal(100n, 0));
            return leftVal.add(markup);
          } else if (node.operator === "-") {
            const discount = leftVal.multiply(percentOperand).divide(new Decimal(100n, 0));
            return leftVal.subtract(discount);
          } else if (node.operator === "*") {
            const factor = percentOperand.divide(new Decimal(100n, 0));
            return leftVal.multiply(factor);
          } else if (node.operator === "/") {
            const factor = percentOperand.divide(new Decimal(100n, 0));
            if (factor.isZero()) {
              throw new DivisionByZeroError();
            }
            return leftVal.divide(factor);
          }
        }

        const leftVal = this.evaluateNode(node.left);
        const rightVal = this.evaluateNode(node.right);

        switch (node.operator) {
          case "+":
            return leftVal.add(rightVal);
          case "-":
            return leftVal.subtract(rightVal);
          case "*":
            return leftVal.multiply(rightVal);
          case "/":
            if (rightVal.isZero()) {
              throw new DivisionByZeroError();
            }
            return leftVal.divide(rightVal);
          default:
            throw new Error("Unsupported binary operator");
        }
      }

      default:
        throw new Error("Unknown AST node type");
    }
  }
}
