import type { CalculatorState } from "../../state/calculator-machine.ts";
import { createElement } from "../dom-utils.ts";

export class CalculatorDisplay {
  public readonly element: HTMLElement;
  public readonly metaEl: HTMLElement;
  public readonly angleBadgeEl: HTMLElement;
  public readonly secondBadgeEl: HTMLElement;
  public readonly formulaEl: HTMLElement;
  public readonly valueEl: HTMLElement;

  constructor() {
    this.element = createElement<HTMLElement>("div");
    this.element.className = "calculator-display";
    this.element.setAttribute("role", "region");
    this.element.setAttribute("aria-label", "Calculator Display");

    this.metaEl = createElement<HTMLElement>("div");
    this.metaEl.className = "display-meta";

    this.angleBadgeEl = createElement<HTMLElement>("span");
    this.angleBadgeEl.id = "badge-angle-mode";
    this.angleBadgeEl.className = "badge-pill badge-angle";
    this.angleBadgeEl.setAttribute("aria-label", "Active angle mode: DEG");
    this.angleBadgeEl.textContent = "DEG";

    this.secondBadgeEl = createElement<HTMLElement>("span");
    this.secondBadgeEl.id = "badge-second-active";
    this.secondBadgeEl.className = "badge-pill badge-second hidden";
    this.secondBadgeEl.setAttribute("aria-label", "2nd function layer active");
    this.secondBadgeEl.textContent = "2nd";

    this.metaEl.appendChild(this.angleBadgeEl);
    this.metaEl.appendChild(this.secondBadgeEl);

    this.formulaEl = createElement<HTMLElement>("div");
    this.formulaEl.className = "display-formula";
    this.formulaEl.setAttribute("aria-label", "Formula expression");

    this.valueEl = createElement<HTMLElement>("div");
    this.valueEl.className = "display-value";
    this.valueEl.setAttribute("role", "status");
    this.valueEl.setAttribute("aria-live", "polite");
    this.valueEl.textContent = "0";

    this.element.appendChild(this.metaEl);
    this.element.appendChild(this.formulaEl);
    this.element.appendChild(this.valueEl);
  }

  public update(state: CalculatorState): void {
    this.angleBadgeEl.textContent = state.angleMode;
    this.angleBadgeEl.setAttribute("aria-label", `Active angle mode: ${state.angleMode}`);

    if (state.isSecondActive) {
      this.secondBadgeEl.classList.remove("hidden");
    } else {
      this.secondBadgeEl.classList.add("hidden");
    }

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
