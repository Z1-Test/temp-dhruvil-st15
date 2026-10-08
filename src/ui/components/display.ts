import type { CalculatorState } from "../../state/calculator-machine.ts";
import { createElement } from "../dom-utils.ts";

export class CalculatorDisplay {
  public readonly element: HTMLElement;
  public readonly formulaEl: HTMLElement;
  public readonly valueEl: HTMLElement;

  constructor() {
    this.element = createElement<HTMLElement>("div");
    this.element.className = "calculator-display";
    this.element.setAttribute("role", "region");
    this.element.setAttribute("aria-label", "Calculator Display");

    this.formulaEl = createElement<HTMLElement>("div");
    this.formulaEl.className = "display-formula";
    this.formulaEl.setAttribute("aria-label", "Formula expression");

    this.valueEl = createElement<HTMLElement>("div");
    this.valueEl.className = "display-value";
    this.valueEl.setAttribute("role", "status");
    this.valueEl.setAttribute("aria-live", "polite");
    this.valueEl.textContent = "0";

    this.element.appendChild(this.formulaEl);
    this.element.appendChild(this.valueEl);
  }

  public update(state: CalculatorState): void {
    this.formulaEl.textContent = state.expression || "";

    if (state.error) {
      this.valueEl.setAttribute("aria-live", "assertive");
      this.valueEl.className = "display-value display-error";
      this.valueEl.textContent = state.error;
    } else {
      this.valueEl.setAttribute("aria-live", "polite");
      this.valueEl.className = "display-value";
      this.valueEl.textContent = state.preview ? state.preview : state.display;
    }
  }
}
