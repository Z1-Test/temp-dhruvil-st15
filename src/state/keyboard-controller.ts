import { CalculatorMachine } from "./calculator-machine.ts";

export interface KeypressEventLike {
  key: string;
  preventDefault?: () => void;
}

/**
 * Controller listening for physical keyboard keystrokes and translating them
 * into CalculatorMachine actions, ensuring 100% parity with keypad buttons.
 */
export class KeyboardController {
  private readonly machine: CalculatorMachine;
  private target: EventTarget | null = null;
  private listener: ((event: Event) => void) | null = null;

  constructor(machine: CalculatorMachine) {
    this.machine = machine;
  }

  public handleKeyEvent(event: KeypressEventLike): boolean {
    const key = event.key;

    // Digits 0-9
    if (/^[0-9]$/.test(key)) {
      event.preventDefault?.();
      this.machine.inputDigit(key);
      return true;
    }

    // Decimal point
    if (key === ".") {
      event.preventDefault?.();
      this.machine.inputDecimal();
      return true;
    }

    // Binary operators
    if (key === "+" || key === "-" || key === "*" || key === "/" || key === "%" || key === "^") {
      event.preventDefault?.();
      this.machine.inputOperator(key);
      return true;
    }

    // Factorial !
    if (key === "!") {
      event.preventDefault?.();
      this.machine.inputFactorial();
      return true;
    }

    // Comma ,
    if (key === ",") {
      event.preventDefault?.();
      this.machine.inputComma();
      return true;
    }

    // Constants pi / e
    if (key === "p" || key === "P") {
      event.preventDefault?.();
      this.machine.inputConstant("π");
      return true;
    }
    if (key === "e" || key === "E") {
      event.preventDefault?.();
      this.machine.inputConstant("e");
      return true;
    }

    // Parentheses
    if (key === "(" || key === ")") {
      event.preventDefault?.();
      this.machine.inputParenthesis(key);
      return true;
    }

    // Commit: Enter or =
    if (key === "Enter" || key === "=") {
      event.preventDefault?.();
      this.machine.commit();
      return true;
    }

    // Clear: Escape, c, C
    if (key === "Escape" || key === "c" || key === "C") {
      event.preventDefault?.();
      this.machine.clear();
      return true;
    }

    // Backspace: Backspace, Delete
    if (key === "Backspace" || key === "Delete") {
      event.preventDefault?.();
      this.machine.backspace();
      return true;
    }

    return false;
  }

  public attach(target: EventTarget): void {
    this.detach();
    this.target = target;
    this.listener = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      this.handleKeyEvent(keyEvent);
    };
    this.target.addEventListener("keydown", this.listener);
  }

  public detach(): void {
    if (this.target && this.listener) {
      this.target.removeEventListener("keydown", this.listener);
      this.target = null;
      this.listener = null;
    }
  }
}
