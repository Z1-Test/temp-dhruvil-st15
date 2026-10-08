export type CalculationResult =
  | { success: true; value: string; formatted: string }
  | { success: false; error: CalculationError };

export interface CalculationError {
  code:
    | "DIVIDE_BY_ZERO"
    | "SYNTAX_ERROR"
    | "DOMAIN_ERROR"
    | "OVERFLOW"
    | "UNCLOSED_PARENTHESES";
  message: string;
  position?: number;
}
