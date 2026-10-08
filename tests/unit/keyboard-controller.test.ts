import test from "node:test";
import assert from "node:assert/strict";
import { CalculatorMachine } from "../../src/state/calculator-machine.ts";
import { KeyboardController } from "../../src/state/keyboard-controller.ts";

test("KeyboardController: mirrors button interactions for arithmetic input", () => {
  const machine = new CalculatorMachine();
  const controller = new KeyboardController(machine);

  let defaultPrevented = false;
  const mockPrevent = () => {
    defaultPrevented = true;
  };

  // Type: 1 5 + 6 * 4 - 1 0 / 2 Enter
  const keys = ["1", "5", "+", "6", "*", "4", "-", "1", "0", "/", "2", "Enter"];
  for (const k of keys) {
    const handled = controller.handleKeyEvent({ key: k, preventDefault: mockPrevent });
    assert.equal(handled, true);
  }

  // 15 + 6 * 4 - 10 / 2 = 34
  assert.equal(machine.getState().display, "34");
  assert.equal(defaultPrevented, true);
});

test("KeyboardController: handles Clear with Escape and c", () => {
  const machine = new CalculatorMachine();
  const controller = new KeyboardController(machine);

  controller.handleKeyEvent({ key: "9" });
  assert.equal(machine.getState().display, "9");

  controller.handleKeyEvent({ key: "Escape" });
  assert.equal(machine.getState().display, "0");

  controller.handleKeyEvent({ key: "8" });
  assert.equal(machine.getState().display, "8");

  controller.handleKeyEvent({ key: "c" });
  assert.equal(machine.getState().display, "0");
});

test("KeyboardController: handles Backspace", () => {
  const machine = new CalculatorMachine();
  const controller = new KeyboardController(machine);

  controller.handleKeyEvent({ key: "1" });
  controller.handleKeyEvent({ key: "2" });
  assert.equal(machine.getState().display, "12");

  controller.handleKeyEvent({ key: "Backspace" });
  assert.equal(machine.getState().display, "1");
});
