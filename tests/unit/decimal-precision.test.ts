import test from "node:test";
import assert from "node:assert/strict";
import { StandardEvaluator } from "../../src/core/evaluators/standard-evaluator.ts";

test("CASE-STD-02: High Precision Decimal Exactness (NEVER-STD-01)", () => {
  // 0.1 + 0.2 must be strictly 0.3 without binary IEEE-754 drift
  const r1 = StandardEvaluator.evaluate("0.1 + 0.2");
  assert.equal(r1.success, true);
  if (r1.success) {
    assert.equal(r1.value, "0.3");
    assert.notEqual(r1.value, "0.30000000000000004");
  }

  const r2 = StandardEvaluator.evaluate("0.7 + 0.1");
  assert.equal(r2.success, true);
  if (r2.success) {
    assert.equal(r2.value, "0.8");
  }

  const r3 = StandardEvaluator.evaluate("1.0 - 0.9");
  assert.equal(r3.success, true);
  if (r3.success) {
    assert.equal(r3.value, "0.1");
  }

  const r4 = StandardEvaluator.evaluate("0.1 * 0.2");
  assert.equal(r4.success, true);
  if (r4.success) {
    assert.equal(r4.value, "0.02");
  }

  const r5 = StandardEvaluator.evaluate("10 / 4");
  assert.equal(r5.success, true);
  if (r5.success) {
    assert.equal(r5.value, "2.5");
  }
});

test("Arbitrary Precision: large integers exceeding IEEE-754 safe integer", () => {
  const r = StandardEvaluator.evaluate("9007199254740991 + 9");
  assert.equal(r.success, true);
  if (r.success) {
    assert.equal(r.value, "9007199254741000");
  }
});
