import test from "node:test";
import assert from "node:assert/strict";
import { UniversalCalculator } from "../../src/ui/components/calculator.ts";

test("E2E Scientific Acceptance 1: Scientific keypad renders with functions, constants and mode toggles", () => {
  const calc = new UniversalCalculator();
  assert.ok(calc.element);
  assert.ok(calc.display.element);
  assert.ok(calc.keypad.element);

  const buttons = Array.from(calc.keypad.element.children);
  const labels = buttons.map((b) => b.getAttribute("aria-label"));

  assert.ok(labels.includes("Sine function"));
  assert.ok(labels.includes("Cosine function"));
  assert.ok(labels.includes("Tangent function"));
  assert.ok(labels.includes("Natural logarithm"));
  assert.ok(labels.includes("Common logarithm (base 10)"));
  assert.ok(labels.includes("Constant Pi"));
  assert.ok(labels.includes("Euler's constant e"));
  assert.ok(labels.includes("Toggle secondary function layer"));
  assert.ok(labels.some((l) => l && l.toLowerCase().includes("angle mode")));
});

test("E2E Scientific Acceptance 2: DEG/RAD mode toggle and live trigonometry evaluation", () => {
  const calc = new UniversalCalculator();

  // sin(30) in DEG -> preview 0.5 -> commit 0.5
  const sinBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-sin") as HTMLButtonElement;
  const btn3 = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-digit-3") as HTMLButtonElement;
  const btn0 = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-digit-0") as HTMLButtonElement;
  const rparenBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-rparen") as HTMLButtonElement;
  const equalsBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-equals") as HTMLButtonElement;

  sinBtn.click();
  btn3.click();
  btn0.click();
  rparenBtn.click();

  assert.equal(calc.display.valueEl.textContent, "0.5");

  equalsBtn.click();
  assert.equal(calc.display.valueEl.textContent, "0.5");
  assert.equal(calc.machine.getState().hasCommitted, true);
});

test("E2E Scientific Acceptance 3: 2nd key toggles inverse trig and powers", () => {
  const calc = new UniversalCalculator();

  const secondBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-2nd") as HTMLButtonElement;
  const sinBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-sin") as HTMLButtonElement;
  const btn0 = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-digit-0") as HTMLButtonElement;
  const dotBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-dot") as HTMLButtonElement;
  const btn5 = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-digit-5") as HTMLButtonElement;
  const rparenBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-rparen") as HTMLButtonElement;
  const equalsBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-equals") as HTMLButtonElement;

  // Click 2nd
  secondBtn.click();
  assert.equal(sinBtn.textContent, "asin");

  // Click asin(0.5)
  sinBtn.click();
  btn0.click();
  dotBtn.click();
  btn5.click();
  rparenBtn.click();
  equalsBtn.click();

  // In DEG mode, asin(0.5) = 30
  assert.equal(calc.display.valueEl.textContent, "30");
});

test("E2E Scientific Acceptance 4: Domain error dims equals button and recovers cleanly", () => {
  const calc = new UniversalCalculator();
  const secondBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-2nd") as HTMLButtonElement;
  const squareBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-square") as HTMLButtonElement;
  const subBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-subtract") as HTMLButtonElement;
  const btn9 = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-digit-9") as HTMLButtonElement;
  const rparenBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-rparen") as HTMLButtonElement;
  const equalsBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-equals") as HTMLButtonElement;
  const backspaceBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-backspace") as HTMLButtonElement;

  // 2nd -> sqrt(-9)
  secondBtn.click();
  squareBtn.click(); // clicks sqrt
  subBtn.click();
  btn9.click();
  rparenBtn.click();

  assert.equal(equalsBtn.getAttribute("aria-disabled"), "true");
  assert.match(calc.display.valueEl.textContent || "", /Domain Error/);

  // Recovery: backspace
  backspaceBtn.click(); // )
  backspaceBtn.click(); // 9
  backspaceBtn.click(); // -
  btn9.click();
  rparenBtn.click();

  assert.equal(equalsBtn.hasAttribute("aria-disabled"), false);
  assert.equal(calc.display.valueEl.textContent, "3");
});
