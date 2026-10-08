import test from "node:test";
import assert from "node:assert/strict";
import { StandardEvaluator } from "../../src/core/evaluators/standard-evaluator.ts";

test("Standard Arithmetic: basic operations", () => {
  const addRes = StandardEvaluator.evaluate("2 + 3");
  assert.equal(addRes.success, true);
  if (addRes.success) {
    assert.equal(addRes.value, "5");
  }

  const subRes = StandardEvaluator.evaluate("10 - 4");
  assert.equal(subRes.success, true);
  if (subRes.success) {
    assert.equal(subRes.value, "6");
  }

  const mulRes = StandardEvaluator.evaluate("7 * 8");
  assert.equal(mulRes.success, true);
  if (mulRes.success) {
    assert.equal(mulRes.value, "56");
  }

  const divRes = StandardEvaluator.evaluate("48 / 6");
  assert.equal(divRes.success, true);
  if (divRes.success) {
    assert.equal(divRes.value, "8");
  }
});

test("CASE-STD-01: Happy Path Multi-Operator Precedence (RULE-STD-01)", () => {
  // Precedence: 15 + 6 * 4 - 10 / 2 => 15 + 24 - 5 = 34
  const res = StandardEvaluator.evaluate("15 + 6 * 4 - 10 / 2");
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.value, "34");
    assert.equal(res.formatted, "34");
  }
});

test("Parentheses override precedence", () => {
  const res = StandardEvaluator.evaluate("(2 + 3) * 4");
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.value, "20");
  }
});

test("Unary minus handling", () => {
  const r1 = StandardEvaluator.evaluate("-5 + 3");
  assert.equal(r1.success, true);
  if (r1.success) {
    assert.equal(r1.value, "-2");
  }

  const r2 = StandardEvaluator.evaluate("5 * -3");
  assert.equal(r2.success, true);
  if (r2.success) {
    assert.equal(r2.value, "-15");
  }

  const r3 = StandardEvaluator.evaluate("-(4 + 6)");
  assert.equal(r3.success, true);
  if (r3.success) {
    assert.equal(r3.value, "-10");
  }
});

test("CASE-STD-05: Percentage markup and discount", () => {
  // Additive markup: 200 + 15% = 230
  const markup = StandardEvaluator.evaluate("200 + 15%");
  assert.equal(markup.success, true);
  if (markup.success) {
    assert.equal(markup.value, "230");
  }

  // Subtractive discount: 200 - 15% = 170
  const discount = StandardEvaluator.evaluate("200 - 15%");
  assert.equal(discount.success, true);
  if (discount.success) {
    assert.equal(discount.value, "170");
  }

  // Percentage multiplier: 200 * 15% = 30
  const mul = StandardEvaluator.evaluate("200 * 15%");
  assert.equal(mul.success, true);
  if (mul.success) {
    assert.equal(mul.value, "30");
  }
});

test("RULE-STD-02: Consecutive operator replacement in parser", () => {
  const res = StandardEvaluator.evaluate("5 + * 3");
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.value, "15");
  }
});
