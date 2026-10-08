import test from "node:test";
import assert from "node:assert/strict";
import { UniversalCalculator } from "../../src/ui/components/calculator.ts";

test("Scientific Keypad: 2nd key toggles button labels and secondary functions", () => {
  const calc = new UniversalCalculator();

  const sinBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-sin") as HTMLButtonElement;
  const secondBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-2nd") as HTMLButtonElement;

  assert.ok(sinBtn);
  assert.ok(secondBtn);

  // Initial state: sin
  assert.equal(sinBtn.textContent, "sin");
  assert.equal(calc.machine.isSecondActive(), false);

  // Click 2nd button
  secondBtn.click();
  assert.equal(calc.machine.isSecondActive(), true);
  assert.equal(sinBtn.textContent, "asin");
  assert.equal(calc.display.secondBadgeEl.classList.contains("hidden"), false);

  // Click asin button to input asin
  sinBtn.click();
  assert.equal(calc.machine.getState().expression, "asin(");

  // Toggle 2nd off
  secondBtn.click();
  assert.equal(calc.machine.isSecondActive(), false);
  assert.equal(sinBtn.textContent, "sin");
  assert.equal(calc.display.secondBadgeEl.classList.contains("hidden"), true);
});

test("Scientific Keypad: Angle mode button cycles DEG -> RAD -> GRAD -> DEG", () => {
  const calc = new UniversalCalculator();
  const angleBtn = Array.from(calc.keypad.element.children).find((b) => b.getAttribute("id") === "btn-angle-mode") as HTMLButtonElement;

  assert.ok(angleBtn);
  assert.equal(angleBtn.textContent, "DEG");
  assert.equal(calc.display.angleBadgeEl.textContent, "DEG");

  // Cycle to RAD
  angleBtn.click();
  assert.equal(angleBtn.textContent, "RAD");
  assert.equal(calc.display.angleBadgeEl.textContent, "RAD");
  assert.equal(calc.machine.getAngleMode(), "RAD");

  // Cycle to GRAD
  angleBtn.click();
  assert.equal(angleBtn.textContent, "GRAD");
  assert.equal(calc.display.angleBadgeEl.textContent, "GRAD");
  assert.equal(calc.machine.getAngleMode(), "GRAD");

  // Cycle back to DEG
  angleBtn.click();
  assert.equal(angleBtn.textContent, "DEG");
  assert.equal(calc.display.angleBadgeEl.textContent, "DEG");
  assert.equal(calc.machine.getAngleMode(), "DEG");
});
