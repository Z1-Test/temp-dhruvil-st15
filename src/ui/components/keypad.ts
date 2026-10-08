import { CalculatorMachine } from "../../state/calculator-machine.ts";
import type { CalculatorState } from "../../state/calculator-machine.ts";
import { createElement } from "../dom-utils.ts";

export interface KeypadButtonConfig {
  label: string;
  ariaLabel: string;
  action: () => void;
  variant?: "digit" | "operator" | "action" | "equals";
  id?: string;
}

export class CalculatorKeypad {
  public readonly element: HTMLElement;
  private readonly machine: CalculatorMachine;
  private equalsBtn: HTMLElement | null = null;

  constructor(machine: CalculatorMachine) {
    this.machine = machine;
    this.element = createElement<HTMLElement>("div");
    this.element.className = "calculator-keypad";
    this.element.setAttribute("role", "group");
    this.element.setAttribute("aria-label", "Calculator Keypad");

    this.renderButtons();
  }

  private renderButtons(): void {
    const buttons: KeypadButtonConfig[] = [
      // Row 1
      { label: "AC", ariaLabel: "Clear all", variant: "action", action: () => this.machine.clear() },
      { label: "⌫", ariaLabel: "Backspace", variant: "action", action: () => this.machine.backspace() },
      { label: "%", ariaLabel: "Percent", variant: "operator", action: () => this.machine.inputOperator("%") },
      { label: "÷", ariaLabel: "Divide", variant: "operator", action: () => this.machine.inputOperator("/") },

      // Row 2
      { label: "7", ariaLabel: "Digit 7", variant: "digit", action: () => this.machine.inputDigit("7") },
      { label: "8", ariaLabel: "Digit 8", variant: "digit", action: () => this.machine.inputDigit("8") },
      { label: "9", ariaLabel: "Digit 9", variant: "digit", action: () => this.machine.inputDigit("9") },
      { label: "×", ariaLabel: "Multiply", variant: "operator", action: () => this.machine.inputOperator("*") },

      // Row 3
      { label: "4", ariaLabel: "Digit 4", variant: "digit", action: () => this.machine.inputDigit("4") },
      { label: "5", ariaLabel: "Digit 5", variant: "digit", action: () => this.machine.inputDigit("5") },
      { label: "6", ariaLabel: "Digit 6", variant: "digit", action: () => this.machine.inputDigit("6") },
      { label: "-", ariaLabel: "Subtract", variant: "operator", action: () => this.machine.inputOperator("-") },

      // Row 4
      { label: "1", ariaLabel: "Digit 1", variant: "digit", action: () => this.machine.inputDigit("1") },
      { label: "2", ariaLabel: "Digit 2", variant: "digit", action: () => this.machine.inputDigit("2") },
      { label: "3", ariaLabel: "Digit 3", variant: "digit", action: () => this.machine.inputDigit("3") },
      { label: "+", ariaLabel: "Add", variant: "operator", action: () => this.machine.inputOperator("+") },

      // Row 5
      { label: "+/-", ariaLabel: "Toggle sign", variant: "action", action: () => this.machine.toggleSign() },
      { label: "0", ariaLabel: "Digit 0", variant: "digit", action: () => this.machine.inputDigit("0") },
      { label: ".", ariaLabel: "Decimal point", variant: "digit", action: () => this.machine.inputDecimal() },
      { label: "=", ariaLabel: "Equals", variant: "equals", id: "btn-equals", action: () => this.machine.commit() },
    ];

    for (const btnConfig of buttons) {
      const btn = createElement<HTMLButtonElement>("button");
      btn.type = "button";
      btn.textContent = btnConfig.label;
      btn.className = `keypad-btn btn-${btnConfig.variant || "digit"}`;
      btn.setAttribute("aria-label", btnConfig.ariaLabel);

      if (btnConfig.id) {
        btn.setAttribute("id", btnConfig.id);
      }

      if (btnConfig.variant === "equals") {
        this.equalsBtn = btn;
      }

      btn.addEventListener("click", () => {
        btnConfig.action();
      });

      this.element.appendChild(btn);
    }
  }

  public update(state: CalculatorState): void {
    if (this.equalsBtn) {
      if (state.isDividingByZero) {
        this.equalsBtn.setAttribute("aria-disabled", "true");
        (this.equalsBtn as any).disabled = true;
        this.equalsBtn.classList.add("btn-disabled");
      } else {
        this.equalsBtn.removeAttribute("aria-disabled");
        (this.equalsBtn as any).disabled = false;
        this.equalsBtn.classList.remove("btn-disabled");
      }
    }
  }
}
