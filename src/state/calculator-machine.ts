import { StandardEvaluator } from "../core/evaluators/standard-evaluator.ts";

export interface CalculatorState {
  expression: string;
  display: string;
  preview: string;
  error: string | null;
  isDividingByZero: boolean;
  hasCommitted: boolean;
}

export type StateListener = (state: CalculatorState) => void;

/**
 * Reactive Calculator State Machine managing expression input, operator replacement,
 * decimal deduplication, live preview calculation, and error recovery.
 */
export class CalculatorMachine {
  private state: CalculatorState;
  private listeners: Set<StateListener> = new Set();
  private lastCommittedResult: string = "0";

  constructor(initialExpression: string = "") {
    this.state = {
      expression: initialExpression,
      display: initialExpression || "0",
      preview: "",
      error: null,
      isDividingByZero: false,
      hasCommitted: false,
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

  public inputDigit(digit: string): void {
    if (!/^[0-9]$/.test(digit)) return;

    if (this.state.hasCommitted) {
      this.state.expression = digit;
      this.state.display = digit;
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
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
    // RULE-STD-03, CASE-STD-06: A numeric operand cannot contain more than one decimal point.
    if (this.state.hasCommitted) {
      this.state.expression = "0.";
      this.state.display = "0.";
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.notify();
      return;
    }

    const currentOperand = this.getCurrentOperand();
    if (currentOperand.includes(".")) {
      // Duplicate decimal point ignored (no-op)
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

  public inputOperator(op: "+" | "-" | "*" | "/" | "×" | "÷" | "%"): void {
    const normalizedOp = op === "×" ? "*" : op === "÷" ? "/" : op;

    // RULE-STD-05, CASE-STD-08: Result chaining on next operator
    if (this.state.hasCommitted) {
      this.state.expression = `${this.lastCommittedResult} ${normalizedOp} `;
      this.state.display = this.lastCommittedResult;
      this.state.hasCommitted = false;
      this.state.error = null;
      this.state.isDividingByZero = false;
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

    // RULE-STD-02, CASE-STD-07: Consecutive operator replacement
    const trailingOpMatch = trimmed.match(/(\s[+\-*/]|\s[+\-*/]\s-)$/);
    if (trailingOpMatch) {
      // If user enters minus after * or /, treat as unary minus
      if (normalizedOp === "-" && (trimmed.endsWith("*") || trimmed.endsWith("/"))) {
        this.state.expression = `${trimmed} -`;
        this.notify();
        return;
      }

      // Otherwise replace previous operator with new operator
      const base = trimmed.replace(/\s*[+\-*/](\s*-)?$/, "");
      this.state.expression = `${base} ${normalizedOp} `;
      this.recalculatePreview();
      this.notify();
      return;
    }

    this.state.expression = `${trimmed} ${normalizedOp} `;
    this.recalculatePreview();
    this.notify();
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
      expression: "",
      display: "0",
      preview: "",
      error: null,
      isDividingByZero: false,
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
      exp = exp.slice(0, -1).trimEnd();
    }

    this.state.expression = exp;
    this.state.display = this.getCurrentOperand() || (exp ? exp : "0");

    // REC-STD-01: clear divide-by-zero error on backspace
    this.state.error = null;
    this.state.isDividingByZero = false;

    this.recalculatePreview();
    this.notify();
  }

  public commit(): void {
    // RULE-STD-04: Cannot commit when division by zero is pending
    if (this.state.isDividingByZero) {
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

    // Auto-balance unclosed parentheses on commit (CASE-STD-04)
    const result = StandardEvaluator.evaluate(trimmed, { autoBalance: true });

    if (result.success) {
      this.lastCommittedResult = result.value;
      this.state.display = result.formatted;
      this.state.preview = "";
      this.state.error = null;
      this.state.isDividingByZero = false;
      this.state.hasCommitted = true;
    } else {
      if (result.error.code === "DIVIDE_BY_ZERO") {
        this.state.error = "Cannot divide by zero";
        this.state.isDividingByZero = true;
        this.state.display = "Cannot divide by zero";
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

    // Attempt evaluation with autoBalance for preview
    const result = StandardEvaluator.evaluate(trimmed, { autoBalance: true });
    if (result.success) {
      this.state.preview = result.formatted;
      this.state.error = null;
      this.state.isDividingByZero = false;
    } else {
      if (result.error.code === "DIVIDE_BY_ZERO") {
        this.state.preview = "Cannot divide by zero";
        this.state.error = "Cannot divide by zero";
        this.state.isDividingByZero = true;
      } else {
        this.state.preview = "";
      }
    }
  }

  private isEndingWithOperator(): boolean {
    const trimmed = this.state.expression.trim();
    return /[+\-*/]$/.test(trimmed);
  }

  private getCurrentOperand(): string {
    const trimmed = this.state.expression.trim();
    const parts = trimmed.split(/[\s+\-*/()]+/);
    return parts[parts.length - 1] || "";
  }

  private replaceCurrentOperand(replacement: string): void {
    const trimmed = this.state.expression.trim();
    const lastOpIdx = Math.max(
      trimmed.lastIndexOf("+"),
      trimmed.lastIndexOf("-"),
      trimmed.lastIndexOf("*"),
      trimmed.lastIndexOf("/")
    );

    if (lastOpIdx === -1) {
      this.state.expression = replacement;
    } else {
      this.state.expression = `${trimmed.slice(0, lastOpIdx + 1)} ${replacement}`;
    }
  }
}
