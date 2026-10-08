import test from "node:test";
import assert from "node:assert/strict";
import { ScientificEvaluator } from "../../src/core/evaluators/scientific-evaluator.ts";

test("CASE-SCI-04: Transcendental Precision with Euler's Number & Natural Log", () => {
  // ln(e^3) = 3
  const res = ScientificEvaluator.evaluate("ln(e ^ 3)");
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.value, "3");
  }

  // ln(e) = 1
  const res1 = ScientificEvaluator.evaluate("ln(e)");
  assert.equal(res1.success, true);
  if (res1.success) {
    assert.equal(res1.value, "1");
  }

  // log(1000) = 3
  const logRes = ScientificEvaluator.evaluate("log(1000)");
  assert.equal(logRes.success, true);
  if (logRes.success) {
    assert.equal(logRes.value, "3");
  }
});

test("Powers and Roots evaluation", () => {
  // 2 ^ 10 = 1024
  const p10 = ScientificEvaluator.evaluate("2 ^ 10");
  assert.equal(p10.success, true);
  if (p10.success) {
    assert.equal(p10.value, "1024");
  }

  // sqrt(144) = 12
  const sqrt144 = ScientificEvaluator.evaluate("sqrt(144)");
  assert.equal(sqrt144.success, true);
  if (sqrt144.success) {
    assert.equal(sqrt144.value, "12");
  }

  // cbrt(27) = 3
  const cbrt27 = ScientificEvaluator.evaluate("cbrt(27)");
  assert.equal(cbrt27.success, true);
  if (cbrt27.success) {
    assert.equal(cbrt27.value, "3");
  }
});
