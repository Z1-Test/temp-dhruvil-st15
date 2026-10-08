import test from "node:test";
import assert from "node:assert/strict";
import { ScientificEvaluator } from "../../src/core/evaluators/scientific-evaluator.ts";

test("CASE-SCI-06: Transcendental Constants High-Precision Expansion (RULE-SCI-04)", () => {
  // Constant π evaluates to full 34+ decimal precision
  const piRes = ScientificEvaluator.evaluate("π");
  assert.equal(piRes.success, true);
  if (piRes.success) {
    assert.ok(piRes.value.startsWith("3.141592653589793238462643383279502"));
  }

  // Constant e evaluates to 34+ decimal precision
  const eRes = ScientificEvaluator.evaluate("e");
  assert.equal(eRes.success, true);
  if (eRes.success) {
    assert.ok(eRes.value.startsWith("2.718281828459045235360287471352662"));
  }

  // Constant ϕ evaluates to 34+ decimal precision
  const phiRes = ScientificEvaluator.evaluate("ϕ");
  assert.equal(phiRes.success, true);
  if (phiRes.success) {
    assert.ok(phiRes.value.startsWith("1.618033988749894848204586834365638"));
  }
});

test("Implicit multiplication with constants (e.g. 2π, 2e)", () => {
  const twoPi = ScientificEvaluator.evaluate("2π");
  assert.equal(twoPi.success, true);
  if (twoPi.success) {
    assert.ok(twoPi.value.startsWith("6.283185307179586476925286766559005"));
  }
});
