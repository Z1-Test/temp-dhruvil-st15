import test from "node:test";
import assert from "node:assert/strict";
import { StandardEvaluator } from "../../src/core/evaluators/standard-evaluator.ts";

test("CASE-STD-04: Parentheses Auto-Balancing on Commit (RULE-STD-01, NEVER-STD-02)", () => {
  // 10 * (4 + 6 with autoBalance=true must balance to 10 * (4 + 6) = 100
  const res = StandardEvaluator.evaluate("10 * (4 + 6", { autoBalance: true });
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.value, "100");
  }
});

test("Nested unclosed parentheses auto-balance correctly", () => {
  // 2 * (3 + (4 * 2 -> 2 * (3 + (4 * 2)) = 2 * (3 + 8) = 22
  const res = StandardEvaluator.evaluate("2 * (3 + (4 * 2", { autoBalance: true });
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.value, "22");
  }
});

test("Without autoBalance, unclosed parentheses report UNCLOSED_PARENTHESES", () => {
  const res = StandardEvaluator.evaluate("10 * (4 + 6", { autoBalance: false });
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.error.code, "UNCLOSED_PARENTHESES");
  }
});
