import { UniversalCalculator } from "./ui/components/calculator.ts";

function init(): void {
  const container = document.getElementById("app");
  if (!container) {
    console.error("Mount container #app not found");
    return;
  }

  const calculator = new UniversalCalculator();
  container.appendChild(calculator.element);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
