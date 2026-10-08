import { ScientificEvaluator } from "./scientific-evaluator.ts";
import type { CalculationResult } from "../types/result.ts";
import type { AngleMode } from "../types/tokens.ts";

export interface EvaluationOptions {
  autoBalance?: boolean;
  angleMode?: AngleMode;
}

/**
 * Standard Arithmetic & Scientific Evaluator conforming to Hexagonal Architecture.
 * Evaluates mathematical expressions using arbitrary-precision Decimals and high-precision scientific arithmetic.
 */
export class StandardEvaluator {
  public static evaluate(expression: string, options: EvaluationOptions = {}): CalculationResult {
    return ScientificEvaluator.evaluate(expression, options);
  }
}
