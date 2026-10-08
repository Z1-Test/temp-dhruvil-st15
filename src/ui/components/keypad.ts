import { CalculatorMachine } from "../../state/calculator-machine.ts";
import type { CalculatorState } from "../../state/calculator-machine.ts";
import { createElement } from "../dom-utils.ts";

export interface KeypadButtonConfig {
  id: string;
  label: string;
  ariaLabel: string;
  action: () => void;
  variant: "digit" | "operator" | "action" | "equals" | "scientific" | "mode";
  secondaryLabel?: string;
  secondaryAriaLabel?: string;
  secondaryAction?: () => void;
}

export class CalculatorKeypad {
  public readonly element: HTMLElement;
  private readonly machine: CalculatorMachine;
  private equalsBtn: HTMLButtonElement | null = null;
  private secondBtn: HTMLButtonElement | null = null;
  private angleModeBtn: HTMLButtonElement | null = null;
  private dynamicButtons: Map<string, { btn: HTMLButtonElement; config: KeypadButtonConfig }> = new Map();

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
      // Row 1: Scientific Functions Layer 1
      {
        id: "btn-2nd",
        label: "2nd",
        ariaLabel: "Toggle secondary function layer",
        variant: "mode",
        action: () => this.machine.toggleSecond(),
      },
      {
        id: "btn-angle-mode",
        label: "DEG",
        ariaLabel: "Toggle angle mode (DEG, RAD, GRAD)",
        variant: "mode",
        action: () => this.machine.toggleAngleMode(),
      },
      {
        id: "btn-sin",
        label: "sin",
        ariaLabel: "Sine function",
        secondaryLabel: "asin",
        secondaryAriaLabel: "Inverse sine function",
        variant: "scientific",
        action: () => this.machine.inputFunction("sin"),
        secondaryAction: () => this.machine.inputFunction("asin"),
      },
      {
        id: "btn-cos",
        label: "cos",
        ariaLabel: "Cosine function",
        secondaryLabel: "acos",
        secondaryAriaLabel: "Inverse cosine function",
        variant: "scientific",
        action: () => this.machine.inputFunction("cos"),
        secondaryAction: () => this.machine.inputFunction("acos"),
      },
      {
        id: "btn-tan",
        label: "tan",
        ariaLabel: "Tangent function",
        secondaryLabel: "atan",
        secondaryAriaLabel: "Inverse tangent function",
        variant: "scientific",
        action: () => this.machine.inputFunction("tan"),
        secondaryAction: () => this.machine.inputFunction("atan"),
      },

      // Row 2: Scientific Functions Layer 2
      {
        id: "btn-ln",
        label: "ln",
        ariaLabel: "Natural logarithm",
        secondaryLabel: "eˣ",
        secondaryAriaLabel: "Exponential e to power x",
        variant: "scientific",
        action: () => this.machine.inputFunction("ln"),
        secondaryAction: () => this.machine.inputFunction("exp"),
      },
      {
        id: "btn-log",
        label: "log",
        ariaLabel: "Common logarithm (base 10)",
        secondaryLabel: "10ˣ",
        secondaryAriaLabel: "10 to power x",
        variant: "scientific",
        action: () => this.machine.inputFunction("log"),
        secondaryAction: () => {
          this.machine.inputDigit("1");
          this.machine.inputDigit("0");
          this.machine.inputPower();
        },
      },
      {
        id: "btn-square",
        label: "x²",
        ariaLabel: "Square",
        secondaryLabel: "√x",
        secondaryAriaLabel: "Square root",
        variant: "scientific",
        action: () => this.machine.inputPower("2"),
        secondaryAction: () => this.machine.inputFunction("sqrt"),
      },
      {
        id: "btn-power",
        label: "xʸ",
        ariaLabel: "Power (x to y)",
        secondaryLabel: "∛x",
        secondaryAriaLabel: "Cube root",
        variant: "scientific",
        action: () => this.machine.inputPower(),
        secondaryAction: () => this.machine.inputFunction("cbrt"),
      },
      {
        id: "btn-factorial",
        label: "x!",
        ariaLabel: "Factorial",
        secondaryLabel: "nCr",
        secondaryAriaLabel: "Combinations nCr",
        variant: "scientific",
        action: () => this.machine.inputFactorial(),
        secondaryAction: () => this.machine.inputOperator("nCr" as any),
      },

      // Row 3: Constants & Parentheses
      {
        id: "btn-pi",
        label: "π",
        ariaLabel: "Constant Pi",
        variant: "scientific",
        action: () => this.machine.inputConstant("π"),
      },
      {
        id: "btn-e",
        label: "e",
        ariaLabel: "Euler's constant e",
        variant: "scientific",
        action: () => this.machine.inputConstant("e"),
      },
      {
        id: "btn-lparen",
        label: "(",
        ariaLabel: "Open parenthesis",
        variant: "scientific",
        action: () => this.machine.inputParenthesis("("),
      },
      {
        id: "btn-rparen",
        label: ")",
        ariaLabel: "Close parenthesis",
        variant: "scientific",
        action: () => this.machine.inputParenthesis(")"),
      },
      {
        id: "btn-percent",
        label: "%",
        ariaLabel: "Percent",
        variant: "operator",
        action: () => this.machine.inputOperator("%"),
      },

      // Row 4: Controls & Division
      {
        id: "btn-clear",
        label: "AC",
        ariaLabel: "Clear all",
        variant: "action",
        action: () => this.machine.clear(),
      },
      {
        id: "btn-backspace",
        label: "⌫",
        ariaLabel: "Backspace",
        variant: "action",
        action: () => this.machine.backspace(),
      },
      {
        id: "btn-sign",
        label: "+/-",
        ariaLabel: "Toggle sign",
        variant: "action",
        action: () => this.machine.toggleSign(),
      },
      {
        id: "btn-divide",
        label: "÷",
        ariaLabel: "Divide",
        variant: "operator",
        action: () => this.machine.inputOperator("/"),
      },
      {
        id: "btn-multiply",
        label: "×",
        ariaLabel: "Multiply",
        variant: "operator",
        action: () => this.machine.inputOperator("*"),
      },

      // Row 5: Digits 7, 8, 9 & Subtraction
      {
        id: "btn-digit-7",
        label: "7",
        ariaLabel: "Digit 7",
        variant: "digit",
        action: () => this.machine.inputDigit("7"),
      },
      {
        id: "btn-digit-8",
        label: "8",
        ariaLabel: "Digit 8",
        variant: "digit",
        action: () => this.machine.inputDigit("8"),
      },
      {
        id: "btn-digit-9",
        label: "9",
        ariaLabel: "Digit 9",
        variant: "digit",
        action: () => this.machine.inputDigit("9"),
      },
      {
        id: "btn-subtract",
        label: "-",
        ariaLabel: "Subtract",
        variant: "operator",
        action: () => this.machine.inputOperator("-"),
      },
      {
        id: "btn-add",
        label: "+",
        ariaLabel: "Add",
        variant: "operator",
        action: () => this.machine.inputOperator("+"),
      },

      // Row 6: Digits 4, 5, 6, 1, 2
      {
        id: "btn-digit-4",
        label: "4",
        ariaLabel: "Digit 4",
        variant: "digit",
        action: () => this.machine.inputDigit("4"),
      },
      {
        id: "btn-digit-5",
        label: "5",
        ariaLabel: "Digit 5",
        variant: "digit",
        action: () => this.machine.inputDigit("5"),
      },
      {
        id: "btn-digit-6",
        label: "6",
        ariaLabel: "Digit 6",
        variant: "digit",
        action: () => this.machine.inputDigit("6"),
      },
      {
        id: "btn-digit-1",
        label: "1",
        ariaLabel: "Digit 1",
        variant: "digit",
        action: () => this.machine.inputDigit("1"),
      },
      {
        id: "btn-digit-2",
        label: "2",
        ariaLabel: "Digit 2",
        variant: "digit",
        action: () => this.machine.inputDigit("2"),
      },

      // Row 7: Digits 3, 0, dot, equals
      {
        id: "btn-digit-3",
        label: "3",
        ariaLabel: "Digit 3",
        variant: "digit",
        action: () => this.machine.inputDigit("3"),
      },
      {
        id: "btn-digit-0",
        label: "0",
        ariaLabel: "Digit 0",
        variant: "digit",
        action: () => this.machine.inputDigit("0"),
      },
      {
        id: "btn-dot",
        label: ".",
        ariaLabel: "Decimal point",
        variant: "digit",
        action: () => this.machine.inputDecimal(),
      },
      {
        id: "btn-equals",
        label: "=",
        ariaLabel: "Equals",
        variant: "equals",
        action: () => this.machine.commit(),
      },
    ];

    for (const btnConfig of buttons) {
      const btn = createElement<HTMLButtonElement>("button");
      btn.type = "button";
      btn.textContent = btnConfig.label;
      btn.className = `keypad-btn btn-${btnConfig.variant}`;
      btn.setAttribute("aria-label", btnConfig.ariaLabel);
      btn.setAttribute("id", btnConfig.id);

      if (btnConfig.id === "btn-equals") {
        this.equalsBtn = btn;
      }
      if (btnConfig.id === "btn-2nd") {
        this.secondBtn = btn;
      }
      if (btnConfig.id === "btn-angle-mode") {
        this.angleModeBtn = btn;
      }

      this.dynamicButtons.set(btnConfig.id, { btn, config: btnConfig });

      btn.addEventListener("click", () => {
        const is2nd = this.machine.isSecondActive();
        if (is2nd && btnConfig.secondaryAction) {
          btnConfig.secondaryAction();
        } else {
          btnConfig.action();
        }
      });

      this.element.appendChild(btn);
    }
  }

  public update(state: CalculatorState): void {
    // 1. Equals button state
    if (this.equalsBtn) {
      if (state.isDividingByZero || state.hasDomainError) {
        this.equalsBtn.setAttribute("aria-disabled", "true");
        this.equalsBtn.disabled = true;
        this.equalsBtn.classList.add("btn-disabled");
      } else {
        this.equalsBtn.removeAttribute("aria-disabled");
        this.equalsBtn.disabled = false;
        this.equalsBtn.classList.remove("btn-disabled");
      }
    }

    // 2. 2nd toggle button visual state
    if (this.secondBtn) {
      if (state.isSecondActive) {
        this.secondBtn.classList.add("btn-active");
        this.secondBtn.setAttribute("aria-pressed", "true");
      } else {
        this.secondBtn.classList.remove("btn-active");
        this.secondBtn.setAttribute("aria-pressed", "false");
      }
    }

    // 3. Angle mode button label
    if (this.angleModeBtn) {
      this.angleModeBtn.textContent = state.angleMode;
      this.angleModeBtn.setAttribute("aria-label", `Angle mode: ${state.angleMode} (click to toggle)`);
    }

    // 4. Update secondary buttons
    for (const { btn, config } of this.dynamicButtons.values()) {
      if (config.secondaryLabel) {
        if (state.isSecondActive) {
          btn.textContent = config.secondaryLabel;
          btn.setAttribute("aria-label", config.secondaryAriaLabel || config.secondaryLabel);
        } else {
          btn.textContent = config.label;
          btn.setAttribute("aria-label", config.ariaLabel);
        }
      }
    }
  }
}
