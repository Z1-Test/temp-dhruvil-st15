export type TokenKind =
  | "NUMBER"
  | "OPERATOR"
  | "LPAREN"
  | "RPAREN"
  | "PERCENT"
  | "UNARY_MINUS";

export type OperatorSymbol = "+" | "-" | "*" | "/" | "×" | "÷";

export interface Token {
  kind: TokenKind;
  value: string;
  position: number;
}

export interface OperatorPrecedence {
  precedence: number;
  associativity: "left" | "right";
}

export const OPERATOR_METADATA: Record<string, OperatorPrecedence> = {
  "+": { precedence: 1, associativity: "left" },
  "-": { precedence: 1, associativity: "left" },
  "*": { precedence: 2, associativity: "left" },
  "/": { precedence: 2, associativity: "left" },
  "×": { precedence: 2, associativity: "left" },
  "÷": { precedence: 2, associativity: "left" },
  "%": { precedence: 2, associativity: "left" },
  "u-": { precedence: 3, associativity: "right" },
};
