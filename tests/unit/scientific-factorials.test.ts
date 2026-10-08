import test from "node:test";
import assert from "node:assert/strict";
import { ScientificEvaluator } from "../../src/core/evaluators/scientific-evaluator.ts";

test("CASE-SCI-03: Large Factorial Evaluation (n!) (RULE-SCI-03, NEVER-SCI-02)", () => {
  // 10! = 3628800
  const f10 = ScientificEvaluator.evaluate("10!");
  assert.equal(f10.success, true);
  if (f10.success) {
    assert.equal(f10.value, "3628800");
  }

  // 100! in sub-5ms returning full scientific representation
  const start = performance.now();
  const f100 = ScientificEvaluator.evaluate("100!");
  const duration = performance.now() - start;

  assert.ok(duration < 15, `Factorial calculation took ${duration}ms, expected sub-15ms`);
  assert.equal(f100.success, true);
  if (f100.success) {
    assert.match(f100.value, /^9\.332621544394415e\+157/);
  }
});

test("CASE-SCI-05: Combinations and Permutations (RULE-SCI-03)", () => {
  // 10 nCr 3 = 120
  const nCrRes = ScientificEvaluator.evaluate("10 nCr 3");
  assert.equal(nCrRes.success, true);
  if (nCrRes.success) {
    assert.equal(nCrRes.value, "120");
  }

  // 10 nPr 3 = 720
  const nPrRes = ScientificEvaluator.evaluate("10 nPr 3");
  assert.equal(nPrRes.success, true);
  if (nPrRes.success) {
    assert.equal(nPrRes.value, "720");
  }
});

test("Factorial domain fencing: non-negative integer requirement (RULE-SCI-03)", () => {
  const negFact = ScientificEvaluator.evaluate("(-5)!");
  assert.equal(negFact.success, false);
  if (!negFact.success) {
    assert.equal(negFact.error.code, "DOMAIN_ERROR");
  }
});
