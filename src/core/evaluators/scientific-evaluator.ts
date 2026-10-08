import { Decimal, DivisionByZeroError } from "../decimal/decimal.ts";
import { Lexer, LexerError } from "../lexer/lexer.ts";
import { Parser, ParserError } from "../parser/parser.ts";
import type { ASTNode } from "../parser/parser.ts";
import { DomainError, ScientificMath } from "../scientific/scientific-math.ts";
import type { CalculationResult } from "../types/result.ts";
import type { AngleMode } from "../types/tokens.ts";

export interface ScientificEvaluationOptions {
  autoBalance?: boolean;
  angleMode?: AngleMode;
}

/**
 * Scientific Mathematical Evaluator.
 * Evaluates complex expressions containing trigonometric, logarithmic, power, root,
 * combinatorial, and constant terms with high precision and robust domain error fencing.
 */
export class ScientificEvaluator {
  public static evaluate(expression: string, options: ScientificEvaluationOptions = {}): CalculationResult {
    const trimmed = expression.trim();
    if (!trimmed) {
      return {
        success: true,
        value: "0",
        formatted: "0",
      };
    }

    const angleMode = options.angleMode ?? "DEG";

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

      const resultDec = this.evaluateNode(ast, angleMode);
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

      if (err instanceof DomainError) {
        return {
          success: false,
          error: {
            code: "DOMAIN_ERROR",
            message: err.message,
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

  private static evaluateNode(node: ASTNode, angleMode: AngleMode): Decimal {
    switch (node.type) {
      case "number":
        return node.value;

      case "constant": {
        const name = node.name.toLowerCase();
        if (name === "pi" || name === "π") return ScientificMath.PI;
        if (name === "e") return ScientificMath.E;
        if (name === "phi" || name === "ϕ") return ScientificMath.PHI;
        throw new DomainError(`Unknown constant "${node.name}"`);
      }

      case "unary": {
        const val = this.evaluateNode(node.operand, angleMode);
        return val.negate();
      }

      case "percent": {
        const val = this.evaluateNode(node.operand, angleMode);
        return val.divide(new Decimal(100n, 0));
      }

      case "factorial": {
        const val = this.evaluateNode(node.operand, angleMode);
        return ScientificMath.factorial(val);
      }

      case "function": {
        const evaluatedArgs = node.args.map((arg) => this.evaluateNode(arg, angleMode));
        return this.evaluateFunction(node.name, evaluatedArgs, angleMode);
      }

      case "binary": {
        // Special percentage markup/discount handling (e.g. 200 + 15% -> 230)
        if (node.right.type === "percent") {
          const leftVal = this.evaluateNode(node.left, angleMode);
          const percentOperand = this.evaluateNode(node.right.operand, angleMode);

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

        const leftVal = this.evaluateNode(node.left, angleMode);
        const rightVal = this.evaluateNode(node.right, angleMode);

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
          case "^":
            return ScientificMath.pow(leftVal, rightVal);
          case "mod": {
            if (rightVal.isZero()) {
              throw new DivisionByZeroError();
            }
            const l = parseFloat(leftVal.toString());
            const r = parseFloat(rightVal.toString());
            return Decimal.fromNumber(l % r);
          }
          case "nCr":
          case "ncr":
            return ScientificMath.nCr(leftVal, rightVal);
          case "nPr":
          case "npr":
            return ScientificMath.nPr(leftVal, rightVal);
          default:
            throw new Error(`Unsupported binary operator "${node.operator}"`);
        }
      }

      default:
        throw new Error("Unknown AST node type");
    }
  }

  private static evaluateFunction(name: string, args: Decimal[], angleMode: AngleMode): Decimal {
    const fnName = name.toLowerCase();

    if (args.length === 0) {
      throw new DomainError(`Function "${name}" requires at least one argument`);
    }

    const first = args[0];

    switch (fnName) {
      case "sin":
        return ScientificMath.sin(first, angleMode);
      case "cos":
        return ScientificMath.cos(first, angleMode);
      case "tan":
        return ScientificMath.tan(first, angleMode);
      case "asin":
        return ScientificMath.asin(first, angleMode);
      case "acos":
        return ScientificMath.acos(first, angleMode);
      case "atan":
        return ScientificMath.atan(first, angleMode);
      case "csc": {
        const s = ScientificMath.sin(first, angleMode);
        if (s.isZero()) throw new DomainError("Domain Error: Input out of range (csc undefined)");
        return Decimal.ONE.divide(s);
      }
      case "sec": {
        const c = ScientificMath.cos(first, angleMode);
        if (c.isZero()) throw new DomainError("Domain Error: Input out of range (sec undefined)");
        return Decimal.ONE.divide(c);
      }
      case "cot": {
        const s = ScientificMath.sin(first, angleMode);
        const c = ScientificMath.cos(first, angleMode);
        if (s.isZero()) throw new DomainError("Domain Error: Input out of range (cot undefined)");
        return c.divide(s);
      }
      case "acsc": {
        if (first.isZero()) throw new DomainError("Domain Error: Input out of range");
        return ScientificMath.asin(Decimal.ONE.divide(first), angleMode);
      }
      case "asec": {
        if (first.isZero()) throw new DomainError("Domain Error: Input out of range");
        return ScientificMath.acos(Decimal.ONE.divide(first), angleMode);
      }
      case "acot": {
        if (first.isZero()) return ScientificMath.atan(Decimal.ZERO, angleMode);
        return ScientificMath.atan(Decimal.ONE.divide(first), angleMode);
      }
      case "sinh":
        return ScientificMath.sinh(first);
      case "cosh":
        return ScientificMath.cosh(first);
      case "tanh":
        return ScientificMath.tanh(first);
      case "asinh":
        return ScientificMath.asinh(first);
      case "acosh":
        return ScientificMath.acosh(first);
      case "atanh":
        return ScientificMath.atanh(first);
      case "ln":
        return ScientificMath.ln(first);
      case "log":
      case "log10":
        return ScientificMath.log10(first);
      case "log2":
        return ScientificMath.log2(first);
      case "sqrt":
        return ScientificMath.sqrt(first);
      case "cbrt":
        return ScientificMath.cbrt(first);
      case "exp":
        return ScientificMath.pow(ScientificMath.E, first);
      case "abs":
        return first.abs();
      case "fact":
        return ScientificMath.factorial(first);
      default:
        throw new DomainError(`Unsupported function "${name}"`);
    }
  }
}
