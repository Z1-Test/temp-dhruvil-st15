import test from "node:test";
import assert from "node:assert/strict";
import { CalculatorMachine } from "../../src/state/calculator-machine.ts";

test("CalculatorMachine: initial state is zero", () => {
  const machine = new CalculatorMachine();
  const state = machine.getState();
  assert.equal(state.display, "0");
  assert.equal(state.expression, "");
  assert.equal(state.preview, "");
  assert.equal(state.error, null);
  assert.equal(state.isDividingByZero, false);
});

test("CalculatorMachine: digit inputs and clear", () => {
  const machine = new CalculatorMachine();
  machine.inputDigit("1");
  machine.inputDigit("5");
  assert.equal(machine.getState().display, "15");

  machine.clear();
  assert.equal(machine.getState().display, "0");
  assert.equal(machine.getState().expression, "");
});

test("CalculatorMachine: live preview updates as formula is typed", () => {
  const machine = new CalculatorMachine();
  machine.inputDigit("2");
  machine.inputOperator("+");
  machine.inputDigit("3");
  // Live preview should calculate 5
  assert.equal(machine.getState().preview, "5");

  machine.inputOperator("*");
  machine.inputDigit("4");
  // 2 + 3 * 4 => preview 14
  assert.equal(machine.getState().preview, "14");

  machine.commit();
  // Committed display becomes 14
  assert.equal(machine.getState().display, "14");
  assert.equal(machine.getState().preview, "");
  assert.equal(machine.getState().hasCommitted, true);
});

test("CalculatorMachine: division by zero disables commit", () => {
  const machine = new CalculatorMachine();
  machine.inputDigit("5");
  machine.inputDigit("0");
  machine.inputOperator("/");
  machine.inputDigit("0");

  assert.equal(machine.getState().isDividingByZero, true);
  assert.equal(machine.getState().error, "Cannot divide by zero");

  // Attempting to commit should be a no-op
  machine.commit();
  assert.equal(machine.getState().isDividingByZero, true);
  assert.notEqual(machine.getState().display, "Infinity");
  assert.notEqual(machine.getState().display, "NaN");

  // REC-STD-01: Backspace recovers from divide-by-zero
  machine.backspace();
  assert.equal(machine.getState().isDividingByZero, false);
  assert.equal(machine.getState().error, null);
});
