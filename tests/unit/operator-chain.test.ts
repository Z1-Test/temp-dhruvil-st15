import test from "node:test";
import assert from "node:assert/strict";
import { CalculatorMachine } from "../../src/state/calculator-machine.ts";

test("CASE-STD-07: Consecutive Operator Replacement (RULE-STD-02)", () => {
  const machine = new CalculatorMachine();
  machine.inputDigit("1");
  machine.inputDigit("0");
  machine.inputOperator("+");

  // User immediately presses *
  machine.inputOperator("*");
  machine.inputDigit("5");
  machine.commit();

  // 10 * 5 = 50
  assert.equal(machine.getState().display, "50");
});

test("Consecutive operator with unary negation exception (e.g. 5 * -3)", () => {
  const machine = new CalculatorMachine();
  machine.inputDigit("5");
  machine.inputOperator("*");
  machine.inputOperator("-");
  machine.inputDigit("3");
  machine.commit();

  // 5 * -3 = -15
  assert.equal(machine.getState().display, "-15");
});
