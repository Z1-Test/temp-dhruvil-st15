import { ScientificEvaluator } from "../core/evaluators/scientific-evaluator.ts";
import type { AngleMode } from "../core/types/tokens.ts";

export interface CalculatorState {
  expression: string;
  display: string;
  preview: string;
  error: string | null;
  isDividingByZero: boolean;
  hasDomainError: boolean;
  hasCommitted: boolean;
  angleMode: AngleMode;
  isSecondActive: boolean;
}

export type StateListener = (state: CalculatorState) => void;

/**
 * Reactive Calculator State Machine managing expression input, operator replacement,
 * decimal deduplication, scientific functions, angle mode transitions (DEG/RAD/GRAD),
 * 2nd function layer toggling, live preview calculation, and error recovery.
 */
export class CalculatorMachine {
  private state: CalculatorState;
  private listeners: Set<StateListener> = new Set();
  private lastCommittedResult: string = "0";

  constructor(initialExpression: string = "", initialAngleMode: AngleMode = "DEG") {
    this.state = {
      expression: initialExpression,
      display: initialExpression || "0",
      preview: "",
      error: null,
      isDividingByZero: false,
      hasDomainError: false,
      hasCommitted: false,
      angleMode: initialAngleMode,
      isSecondActive: false,
    };
    if (initialExpression) {
      this.recalculatePreview();
    }
  }

  public getState(): Readonly<CalculatorState> {
    return { ...this.state };
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const currentState = this.getState();
    for (const listener of this.listeners) {
      listener(currentState);
    }
  }

  public getAngleMode(): AngleMode {
    return this.state.angleMode;
  }

  public setAngleMode(mode: AngleMode): void {
    this.state.angleMode = mode;
    this.recalculatePreview();
    this.notify();
  }

  public toggleAngleMode(): AngleMode {
    const modes: AngleMode[] = ["DEG", "RAD", "GRAD"];
    const nextIdx = (modes.indexOf(this.state.angleMode) + 1) % modes.length;
    this.state.angleMode = modes[nextIdx];
    this.recalculatePreview();
    this.notify();
    return this.state.angleMode;
  }

  public isSecondActive(): boolean {
    return this.state.isSecondActive;
  }

  public toggleSecond(): boolean {
    this.state.isSecondActive = !this.state.isSecondActive;
    this.notify();
    return this.state.isSecondActive;
  }

  public inputDigit(digit: string): void {
    if (!/^[0-9]$/.test(digit)) return;

    if (this.state.hasCommitted) {
      this.state.expression = digit;
      this.state.display = digit;
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
    } else {
      if (this.state.expression === "0") {
        this.state.expression = digit;
      } else {
        this.state.expression += digit;
      }
      this.state.display = this.getCurrentOperand() || this.state.expression;
    }

    this.recalculatePreview();
    this.notify();
  }

  public inputDecimal(): void {
    if (this.state.hasCommitted) {
      this.state.expression = "0.";
      this.state.display = "0.";
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
      this.notify();
      return;
    }

    const currentOperand = this.getCurrentOperand();
    if (currentOperand.includes(".")) {
      return;
    }

    if (!currentOperand || this.isEndingWithOperator()) {
      this.state.expression += "0.";
    } else {
      this.state.expression += ".";
    }

    this.state.display = this.getCurrentOperand() || this.state.expression;
    this.recalculatePreview();
    this.notify();
  }

  public inputOperator(op: "+" | "-" | "*" | "/" | "×" | "÷" | "%" | "^" | "mod" | "nCr" | "nPr"): void {
    const normalizedOp = op === "×" ? "*" : op === "÷" ? "/" : op;

    if (this.state.hasCommitted) {
      this.state.expression = `${this.lastCommittedResult} ${normalizedOp} `;
      this.state.display = this.lastCommittedResult;
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
      this.notify();
      return;
    }

    if (normalizedOp === "%") {
      if (this.state.expression && !this.isEndingWithOperator()) {
        this.state.expression += "%";
        this.recalculatePreview();
        this.notify();
      }
      return;
    }

    const trimmed = this.state.expression.trim();

    if (!trimmed) {
      if (normalizedOp === "-") {
        this.state.expression = "-";
        this.state.display = "-";
        this.notify();
      } else {
        this.state.expression = `0 ${normalizedOp} `;
        this.notify();
      }
      return;
    }

    // Consecutive operator replacement
    const trailingOpMatch = trimmed.match(/(\s[+\-*/^]|\s[+\-*/^]\s-)$/);
    if (trailingOpMatch) {
      if (normalizedOp === "-" && (trimmed.endsWith("*") || trimmed.endsWith("/") || trimmed.endsWith("^"))) {
        this.state.expression = `${trimmed} -`;
        this.notify();
        return;
      }

      const base = trimmed.replace(/\s*[+\-*/^](\s*-)?$/, "");
      this.state.expression = `${base} ${normalizedOp} `;
      this.recalculatePreview();
      this.notify();
      return;
    }

    this.state.expression = `${trimmed} ${normalizedOp} `;
    this.recalculatePreview();
    this.notify();
  }

  public inputFunction(fnName: string): void {
    const fn = fnName.trim();
    if (!fn) return;

    if (this.state.hasCommitted) {
      this.state.expression = `${fn}(`;
      this.state.display = `${fn}(`;
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
    } else {
      if (this.state.expression === "0" || !this.state.expression) {
        this.state.expression = `${fn}(`;
      } else {
        const trimmed = this.state.expression.trim();
        if (this.isEndingWithOperator() || trimmed.endsWith("(")) {
          this.state.expression += `${fn}(`;
        } else {
          this.state.expression += ` * ${fn}(`;
        }
      }
      this.state.display = this.getCurrentOperand() || this.state.expression;
    }

    this.recalculatePreview();
    this.notify();
  }

  public inputConstant(constSymbol: "π" | "e" | "ϕ" | "pi" | "phi"): void {
    let symbol = constSymbol;
    if (symbol === "pi") symbol = "π";
    if (symbol === "phi") symbol = "ϕ";

    if (this.state.hasCommitted) {
      this.state.expression = symbol;
      this.state.display = symbol;
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
    } else {
      if (this.state.expression === "0" || !this.state.expression) {
        this.state.expression = symbol;
      } else {
        const trimmed = this.state.expression.trim();
        if (this.isEndingWithOperator() || trimmed.endsWith("(")) {
          this.state.expression += symbol;
        } else {
          this.state.expression += ` * ${symbol}`;
        }
      }
      this.state.display = this.getCurrentOperand() || this.state.expression;
    }

    this.recalculatePreview();
    this.notify();
  }

  public inputFactorial(): void {
    if (this.state.hasCommitted) {
      this.state.expression = `${this.lastCommittedResult}!`;
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
    } else if (this.state.expression && !this.isEndingWithOperator()) {
      this.state.expression += "!";
    }
    this.recalculatePreview();
    this.notify();
  }

  public inputPower(exponent?: string): void {
    if (exponent) {
      if (this.state.hasCommitted) {
        this.state.expression = `${this.lastCommittedResult} ^ ${exponent}`;
        this.state.hasCommitted = false;
      } else if (this.state.expression && !this.isEndingWithOperator()) {
        this.state.expression += ` ^ ${exponent}`;
      } else {
        this.state.expression += `0 ^ ${exponent}`;
      }
      this.recalculatePreview();
      this.notify();
    } else {
      this.inputOperator("^");
    }
  }

  public inputParenthesis(paren: "(" | ")"): void {
    if (this.state.hasCommitted) {
      this.state.expression = paren;
      this.state.hasCommitted = false;
    } else {
      if (paren === "(" && this.state.expression && !this.isEndingWithOperator()) {
        this.state.expression += " * (";
      } else {
        this.state.expression += paren;
      }
    }
    this.recalculatePreview();
    this.notify();
  }

  public inputComma(): void {
    if (this.state.expression && !this.isEndingWithOperator()) {
      this.state.expression += ", ";
      this.recalculatePreview();
      this.notify();
    }
  }

  public toggleSign(): void {
    const currentOperand = this.getCurrentOperand();
    if (!currentOperand || currentOperand === "0") return;

    if (currentOperand.startsWith("-")) {
      const positive = currentOperand.slice(1);
      this.replaceCurrentOperand(positive);
    } else {
      const negative = `-${currentOperand}`;
      this.replaceCurrentOperand(negative);
    }

    this.state.display = this.getCurrentOperand();
    this.recalculatePreview();
    this.notify();
  }

  public clear(): void {
    this.state = {
      ...this.state,
      expression: "",
      display: "0",
      preview: "",
      error: null,
      isDividingByZero: false,
      hasDomainError: false,
      hasCommitted: false,
    };
    this.lastCommittedResult = "0";
    this.notify();
  }

  public backspace(): void {
    if (this.state.hasCommitted) {
      this.clear();
      return;
    }

    if (!this.state.expression) {
      return;
    }

    let exp = this.state.expression.trimEnd();
    if (exp.length > 0) {
      // If ending with function name like "sin(" or "asin(", remove the whole token
      const fnMatch = exp.match(/([a-zA-Z0-9]+)\($/);
      if (fnMatch) {
        exp = exp.slice(0, -fnMatch[0].length).trimEnd();
      } else {
        exp = exp.slice(0, -1).trimEnd();
      }
    }

    this.state.expression = exp;
    this.state.display = this.getCurrentOperand() || (exp ? exp : "0");

    this.state.error = null;
    this.state.isDividingByZero = false;
    this.state.hasDomainError = false;

    this.recalculatePreview();
    this.notify();
  }

  public commit(): void {
    if (this.state.isDividingByZero || this.state.hasDomainError) {
      return;
    }

    const trimmed = this.state.expression.trim();
    if (!trimmed) {
      this.state.display = "0";
      this.state.preview = "";
      this.state.hasCommitted = true;
      this.notify();
      return;
    }

    const result = ScientificEvaluator.evaluate(trimmed, {
      autoBalance: true,
      angleMode: this.state.angleMode,
    });

    if (result.success) {
      this.lastCommittedResult = result.value;
      this.state.display = result.formatted;
      this.state.preview = "";
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
      this.state.hasCommitted = true;
    } else {
      if (result.error.code === "DIVIDE_BY_ZERO") {
        this.state.error = "Cannot divide by zero";
        this.state.isDividingByZero = true;
        this.state.display = "Cannot divide by zero";
      } else if (result.error.code === "DOMAIN_ERROR") {
        this.state.error = result.error.message;
        this.state.hasDomainError = true;
        this.state.display = result.error.message;
      } else {
        this.state.error = result.error.message;
      }
    }

    this.notify();
  }

  private recalculatePreview(): void {
    const trimmed = this.state.expression.trim();
    if (!trimmed || this.isEndingWithOperator()) {
      this.state.preview = "";
      return;
    }

    const result = ScientificEvaluator.evaluate(trimmed, {
      autoBalance: true,
      angleMode: this.state.angleMode,
    });

    if (result.success) {
      this.state.preview = result.formatted;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasDomainError = false;
    } else {
      if (result.error.code === "DIVIDE_BY_ZERO") {
        this.state.preview = "Cannot divide by zero";
        this.state.error = "Cannot divide by zero";
        this.state.isDividingByZero = true;
        this.state.hasDomainError = false;
      } else if (result.error.code === "DOMAIN_ERROR") {
        this.state.preview = result.error.message;
        this.state.error = result.error.message;
        this.state.hasDomainError = true;
        this.state.isDividingByZero = false;
      } else {
        this.state.preview = "";
      }
    }
  }

  private isEndingWithOperator(): boolean {
    const trimmed = this.state.expression.trim();
    return /[+\-*/^]$/.test(trimmed) || trimmed.endsWith("mod") || trimmed.endsWith("nCr") || trimmed.endsWith("nPr");
  }

  private getCurrentOperand(): string {
    const trimmed = this.state.expression.trim();
    const parts = trimmed.split(/[\s+\-*/()^,]+/);
    return parts[parts.length - 1] || "";
  }

  private replaceCurrentOperand(replacement: string): void {
    const trimmed = this.state.expression.trim();
    const lastOpIdx = Math.max(
      trimmed.lastIndexOf("+"),
      trimmed.lastIndexOf("-"),
      trimmed.lastIndexOf("*"),
      trimmed.lastIndexOf("/"),
      trimmed.lastIndexOf("^")
    );

    if (lastOpIdx === -1) {
      this.state.expression = replacement;
    } else {
      this.state.expression = `${trimmed.slice(0, lastOpIdx + 1)} ${replacement}`;
    }
  }
}
