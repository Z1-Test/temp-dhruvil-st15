import { CalculatorMachine } from "../../state/calculator-machine.ts";
import type { CalculatorState } from "../../state/calculator-machine.ts";
import { KeyboardController } from "../../state/keyboard-controller.ts";
import { createElement } from "../dom-utils.ts";
import { CalculatorDisplay } from "./display.ts";
import { CalculatorKeypad } from "./keypad.ts";

export class UniversalCalculator {
  public readonly element: HTMLElement;
  public readonly machine: CalculatorMachine;
  public readonly display: CalculatorDisplay;
  public readonly keypad: CalculatorKeypad;
  public readonly keyboardController: KeyboardController;
  private unsubscribe: (() => void) | null = null;

  constructor(initialExpression: string = "") {
    this.machine = new CalculatorMachine(initialExpression);
    this.keyboardController = new KeyboardController(this.machine);

    this.element = createElement<HTMLElement>("section");
    this.element.className = "universal-calculator";
    this.element.setAttribute("aria-label", "Basic Calculator");

    this.display = new CalculatorDisplay();
    this.keypad = new CalculatorKeypad(this.machine);

    this.element.appendChild(this.display.element);
    this.element.appendChild(this.keypad.element);

    this.unsubscribe = this.machine.subscribe((state: CalculatorState) => {
      this.display.update(state);
      this.keypad.update(state);
    });

    if (typeof window !== "undefined") {
      this.keyboardController.attach(window);
    }
  }

  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.keyboardController.detach();
  }
}
