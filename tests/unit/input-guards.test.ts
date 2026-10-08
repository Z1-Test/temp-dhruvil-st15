import test from "node:test";
import assert from "node:assert/strict";
import { CalculatorMachine } from "../../src/state/calculator-machine.ts";

test("CASE-STD-06: Double Decimal Prevention (RULE-STD-03)", () => {
  const machine = new CalculatorMachine();
  machine.inputDigit("1");
  machine.inputDigit("2");
  machine.inputDecimal();
  machine.inputDigit("5");

  assert.equal(machine.getState().display, "12.5");

  // Attempting second decimal point in same operand must be a no-op
  machine.inputDecimal();
  assert.equal(machine.getState().display, "12.5");
  assert.equal(machine.getState().expression, "12.5");

  // Entering an operator allows a decimal in the second operand
  machine.inputOperator("+");
  machine.inputDecimal();
  machine.inputDigit("3");
  assert.equal(machine.getState().display, "0.3");

  machine.commit();
  assert.equal(machine.getState().display, "12.8");
});
