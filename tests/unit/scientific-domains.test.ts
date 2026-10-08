import test from "node:test";
import assert from "node:assert/strict";
import { ScientificEvaluator } from "../../src/core/evaluators/scientific-evaluator.ts";
import { CalculatorMachine } from "../../src/state/calculator-machine.ts";

test("CASE-SCI-02: Real-Domain Fencing on Negative Square Root (RULE-SCI-02)", () => {
  const res = ScientificEvaluator.evaluate("sqrt(-16)");
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.error.code, "DOMAIN_ERROR");
    assert.match(res.error.message, /Domain Error.*Negative root/);
  }
});

test("Real-Domain Fencing: Logarithm of zero or negative numbers (RULE-SCI-02)", () => {
  const lnZero = ScientificEvaluator.evaluate("ln(0)");
  assert.equal(lnZero.success, false);
  if (!lnZero.success) {
    assert.equal(lnZero.error.code, "DOMAIN_ERROR");
    assert.match(lnZero.error.message, /Domain Error.*Input out of range/);
  }

  const logNeg = ScientificEvaluator.evaluate("log(-10)");
  assert.equal(logNeg.success, false);
  if (!logNeg.success) {
    assert.equal(logNeg.error.code, "DOMAIN_ERROR");
  }
});

test("Real-Domain Fencing: Inverse sine out of [-1, 1] range (RULE-SCI-02)", () => {
  const asinInvalid = ScientificEvaluator.evaluate("asin(2)");
  assert.equal(asinInvalid.success, false);
  if (!asinInvalid.success) {
    assert.equal(asinInvalid.error.code, "DOMAIN_ERROR");
  }

  const acosInvalid = ScientificEvaluator.evaluate("acos(-1.5)");
  assert.equal(acosInvalid.success, false);
  if (!acosInvalid.success) {
    assert.equal(acosInvalid.error.code, "DOMAIN_ERROR");
  }
});

test("CalculatorMachine: domain error displays inline and dims equals button without crashing (REC-SCI-01)", () => {
  const machine = new CalculatorMachine();
  machine.inputFunction("sqrt");
  machine.inputOperator("-");
  machine.inputDigit("1");
  machine.inputDigit("6");
  machine.inputParenthesis(")");

  const state = machine.getState();
  assert.equal(state.hasDomainError, true);
  assert.match(state.error || "", /Domain Error/);

  // Commit during domain error is a no-op
  machine.commit();
  assert.notEqual(machine.getState().display, "NaN");
  assert.notEqual(machine.getState().display, "Infinity");

  // Backspace recovers from error (REC-SCI-01)
  machine.backspace(); // removes )
  machine.backspace(); // removes 6
  machine.backspace(); // removes 1
  machine.backspace(); // removes -
  machine.inputDigit("1");
  machine.inputDigit("6");
  machine.inputParenthesis(")");

  assert.equal(machine.getState().hasDomainError, false);
  assert.equal(machine.getState().preview, "4");
});
