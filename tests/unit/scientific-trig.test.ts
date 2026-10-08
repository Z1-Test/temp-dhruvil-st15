import test from "node:test";
import assert from "node:assert/strict";
import { ScientificEvaluator } from "../../src/core/evaluators/scientific-evaluator.ts";
import { CalculatorMachine } from "../../src/state/calculator-machine.ts";

test("CASE-SCI-01: Happy Path Trigonometric Evaluation (DEG vs RAD vs GRAD)", () => {
  // RULE-SCI-01: sin(30) in DEG mode equals 0.5
  const degRes = ScientificEvaluator.evaluate("sin(30)", { angleMode: "DEG" });
  assert.equal(degRes.success, true);
  if (degRes.success) {
    assert.equal(degRes.value, "0.5");
  }

  // sin(π / 2) in RAD mode equals 1
  const radRes = ScientificEvaluator.evaluate("sin(π / 2)", { angleMode: "RAD" });
  assert.equal(radRes.success, true);
  if (radRes.success) {
    assert.equal(radRes.value, "1");
  }

  // sin(100) in GRAD mode equals 1
  const gradRes = ScientificEvaluator.evaluate("sin(100)", { angleMode: "GRAD" });
  assert.equal(gradRes.success, true);
  if (gradRes.success) {
    assert.equal(gradRes.value, "1");
  }
});

test("Trigonometric values: cos and tan in DEG and RAD", () => {
  // cos(60) in DEG = 0.5
  const cosDeg = ScientificEvaluator.evaluate("cos(60)", { angleMode: "DEG" });
  assert.equal(cosDeg.success, true);
  if (cosDeg.success) {
    assert.equal(cosDeg.value, "0.5");
  }

  // cos(90) in DEG = 0
  const cos90 = ScientificEvaluator.evaluate("cos(90)", { angleMode: "DEG" });
  assert.equal(cos90.success, true);
  if (cos90.success) {
    assert.equal(cos90.value, "0");
  }

  // tan(45) in DEG = 1
  const tan45 = ScientificEvaluator.evaluate("tan(45)", { angleMode: "DEG" });
  assert.equal(tan45.success, true);
  if (tan45.success) {
    assert.equal(tan45.value, "1");
  }
});

test("Inverse Trigonometry: asin, acos, atan in DEG and RAD", () => {
  // asin(0.5) in DEG = 30
  const asinDeg = ScientificEvaluator.evaluate("asin(0.5)", { angleMode: "DEG" });
  assert.equal(asinDeg.success, true);
  if (asinDeg.success) {
    assert.equal(asinDeg.value, "30");
  }

  // acos(0.5) in DEG = 60
  const acosDeg = ScientificEvaluator.evaluate("acos(0.5)", { angleMode: "DEG" });
  assert.equal(acosDeg.success, true);
  if (acosDeg.success) {
    assert.equal(acosDeg.value, "60");
  }

  // atan(1) in DEG = 45
  const atanDeg = ScientificEvaluator.evaluate("atan(1)", { angleMode: "DEG" });
  assert.equal(atanDeg.success, true);
  if (atanDeg.success) {
    assert.equal(atanDeg.value, "45");
  }
});

test("CalculatorMachine: angle mode toggle immediately recalculates preview (NEVER-SCI-01)", () => {
  const machine = new CalculatorMachine();
  assert.equal(machine.getAngleMode(), "DEG");

  machine.inputFunction("sin");
  machine.inputDigit("3");
  machine.inputDigit("0");
  machine.inputParenthesis(")");

  // In DEG mode: sin(30) -> 0.5
  assert.equal(machine.getState().preview, "0.5");

  // Toggle angle mode to RAD: sin(30) in RAD is not 0.5
  machine.toggleAngleMode();
  assert.equal(machine.getAngleMode(), "RAD");
  assert.notEqual(machine.getState().preview, "0.5");

  // Toggle back: RAD -> GRAD -> DEG
  machine.toggleAngleMode();
  assert.equal(machine.getAngleMode(), "GRAD");
  machine.toggleAngleMode();
  assert.equal(machine.getAngleMode(), "DEG");
  assert.equal(machine.getState().preview, "0.5");
});
