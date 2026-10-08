import test from "node:test";
import assert from "node:assert/strict";
import { UniversalCalculator } from "../../src/ui/components/calculator.ts";

test("E2E Acceptance 1: Calculator renders with numeric keypad and operators", () => {
  const calc = new UniversalCalculator();
  assert.ok(calc.element);
  assert.ok(calc.display.element);
  assert.ok(calc.keypad.element);

  // Check buttons exist in keypad
  const buttons = Array.from(calc.keypad.element.children);
  assert.ok(buttons.length >= 16);

  // Verify presence of digits 0-9 and operators +, -, *, /, %
  const labels = buttons.map((b) => b.getAttribute("aria-label"));
  assert.ok(labels.includes("Digit 0"));
  assert.ok(labels.includes("Digit 9"));
  assert.ok(labels.includes("Add"));
  assert.ok(labels.includes("Subtract"));
  assert.ok(labels.includes("Multiply"));
  assert.ok(labels.includes("Divide"));
  assert.ok(labels.includes("Equals"));
  assert.ok(labels.includes("Clear all"));
  assert.ok(labels.includes("Decimal point"));
});

test("E2E Acceptance 2: Arithmetic operations compute correct results", () => {
  const calc = new UniversalCalculator();
  // Simulate clicking 1 5 + 6 * 4 - 1 0 / 2 =
  calc.machine.inputDigit("1");
  calc.machine.inputDigit("5");
  calc.machine.inputOperator("+");
  calc.machine.inputDigit("6");
  calc.machine.inputOperator("*");
  calc.machine.inputDigit("4");
  calc.machine.inputOperator("-");
  calc.machine.inputDigit("1");
  calc.machine.inputDigit("0");
  calc.machine.inputOperator("/");
  calc.machine.inputDigit("2");
  calc.machine.commit();

  assert.equal(calc.display.valueEl.textContent, "34");
});

test("E2E Acceptance 3: Clear/reset resets state to zero", () => {
  const calc = new UniversalCalculator();
  calc.machine.inputDigit("9");
  calc.machine.inputDigit("9");
  assert.equal(calc.display.valueEl.textContent, "99");

  calc.machine.clear();
  assert.equal(calc.display.valueEl.textContent, "0");
  assert.equal(calc.display.formulaEl.textContent, "");
  assert.equal(calc.machine.getState().expression, "");
});

test("E2E Acceptance 4: Decimal point input works without duplication", () => {
  const calc = new UniversalCalculator();
  calc.machine.inputDigit("3");
  calc.machine.inputDecimal();
  calc.machine.inputDigit("1");
  calc.machine.inputDigit("4");

  assert.equal(calc.display.valueEl.textContent, "3.14");

  // Pressing duplicate decimal should be ignored
  calc.machine.inputDecimal();
  assert.equal(calc.display.valueEl.textContent, "3.14");
});

test("E2E Acceptance 5: Keyboard input mirrors button interactions", () => {
  const calc = new UniversalCalculator();
  // Simulate keyboard sequence: "2", "5", "*", "4", "Enter"
  calc.keyboardController.handleKeyEvent({ key: "2" });
  calc.keyboardController.handleKeyEvent({ key: "5" });
  calc.keyboardController.handleKeyEvent({ key: "*" });
  calc.keyboardController.handleKeyEvent({ key: "4" });
  calc.keyboardController.handleKeyEvent({ key: "Enter" });

  assert.equal(calc.display.valueEl.textContent, "100");
});

test("E2E Acceptance 6: Division by zero is handled gracefully", () => {
  const calc = new UniversalCalculator();
  calc.machine.inputDigit("4");
  calc.machine.inputDigit("2");
  calc.machine.inputOperator("/");
  calc.machine.inputDigit("0");

  // Live error indication
  assert.equal(calc.display.valueEl.textContent, "Cannot divide by zero");
  assert.equal(calc.machine.getState().isDividingByZero, true);

  // Equals button is disabled
  calc.machine.commit();
  assert.notEqual(calc.display.valueEl.textContent, "Infinity");
  assert.notEqual(calc.display.valueEl.textContent, "NaN");

  // Recover by backspace and entering non-zero digit
  calc.machine.backspace();
  calc.machine.inputDigit("2");
  calc.machine.commit();

  assert.equal(calc.display.valueEl.textContent, "21");
});
