import test from "node:test";
import assert from "node:assert/strict";
import { StandardEvaluator } from "../../src/core/evaluators/standard-evaluator.ts";

test("CASE-STD-03: Division by zero returns structured error (RULE-STD-04, NEVER-STD-02)", () => {
  const res = StandardEvaluator.evaluate("50 / 0");
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.error.code, "DIVIDE_BY_ZERO");
    assert.equal(res.error.message, "Cannot divide by zero");
  }
});

test("Nested division by zero (e.g. 10 / (5 - 5))", () => {
  const res = StandardEvaluator.evaluate("10 / (5 - 5)");
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.error.code, "DIVIDE_BY_ZERO");
    assert.equal(res.error.message, "Cannot divide by zero");
  }
});

test("Zero divided by valid non-zero number succeeds", () => {
  const res = StandardEvaluator.evaluate("0 / 5");
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.value, "0");
  }
});
