import test from "node:test";
import assert from "node:assert/strict";
import { CalculatorMachine } from "../../src/state/calculator-machine.ts";

test("CASE-STD-08: Result Chaining on Next Operator (RULE-STD-05)", () => {
  const machine = new CalculatorMachine();
  // 25 * 2 = 50
  machine.inputDigit("2");
  machine.inputDigit("5");
  machine.inputOperator("*");
  machine.inputDigit("2");
  machine.commit();

  assert.equal(machine.getState().display, "50");

  // Immediately press +
  machine.inputOperator("+");
  machine.inputDigit("1");
  machine.inputDigit("0");
  machine.commit();

  // Evaluates 50 + 10 = 60
  assert.equal(machine.getState().display, "60");
});
