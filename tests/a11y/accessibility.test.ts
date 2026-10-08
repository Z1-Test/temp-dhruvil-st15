import test from "node:test";
import assert from "node:assert/strict";
import { UniversalCalculator } from "../../src/ui/components/calculator.ts";

test("a11y: Container and Display landmark roles and ARIA attributes", () => {
  const calc = new UniversalCalculator();

  assert.equal(calc.element.getAttribute("aria-label"), "Basic Calculator");
  assert.equal(calc.display.element.getAttribute("role"), "region");
  assert.equal(calc.display.element.getAttribute("aria-label"), "Calculator Display");
  assert.equal(calc.display.valueEl.getAttribute("role"), "status");
  assert.equal(calc.display.valueEl.getAttribute("aria-live"), "polite");
});

test("a11y: Error states trigger assertive aria-live announcements", () => {
  const calc = new UniversalCalculator();
  calc.machine.inputDigit("5");
  calc.machine.inputOperator("/");
  calc.machine.inputDigit("0");

  assert.equal(calc.display.valueEl.getAttribute("aria-live"), "assertive");
  assert.equal(calc.display.valueEl.textContent, "Cannot divide by zero");

  // Recovery resets to polite
  calc.machine.backspace();
  assert.equal(calc.display.valueEl.getAttribute("aria-live"), "polite");
});

test("a11y: Keypad group role and button labeling audit", () => {
  const calc = new UniversalCalculator();
  assert.equal(calc.keypad.element.getAttribute("role"), "group");
  assert.equal(calc.keypad.element.getAttribute("aria-label"), "Calculator Keypad");

  const buttons = Array.from(calc.keypad.element.children);
  assert.ok(buttons.length >= 16);

  for (const btn of buttons) {
    const label = btn.getAttribute("aria-label");
    assert.ok(label && label.trim().length > 0, `Button ${btn.textContent} missing aria-label`);
    assert.equal(btn.getAttribute("type") || (btn as any).type, "button");
  }
});

test("a11y: Equals button reflects aria-disabled during invalid division by zero state", () => {
  const calc = new UniversalCalculator();
  const equalsBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-equals");
  assert.ok(equalsBtn);

  assert.equal(equalsBtn.hasAttribute("aria-disabled"), false);

  // Divide by zero
  calc.machine.inputDigit("1");
  calc.machine.inputOperator("/");
  calc.machine.inputDigit("0");

  assert.equal(equalsBtn.getAttribute("aria-disabled"), "true");

  // Recovery restores aria-disabled
  calc.machine.backspace();
  assert.equal(equalsBtn.hasAttribute("aria-disabled"), false);
});
