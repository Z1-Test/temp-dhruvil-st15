export type AngleMode = "DEG" | "RAD" | "GRAD";

export type TokenKind =
  | "NUMBER"
  | "OPERATOR"
  | "LPAREN"
  | "RPAREN"
  | "PERCENT"
  | "UNARY_MINUS"
  | "FUNCTION"
  | "CONSTANT"
  | "FACTORIAL"
  | "COMMA";

export type OperatorSymbol = "+" | "-" | "*" | "/" | "×" | "÷" | "^" | "mod" | "nCr" | "nPr";

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
  "mod": { precedence: 2, associativity: "left" },
  "nCr": { precedence: 2, associativity: "left" },
  "nPr": { precedence: 2, associativity: "left" },
  "ncr": { precedence: 2, associativity: "left" },
  "npr": { precedence: 2, associativity: "left" },
  "%": { precedence: 4, associativity: "left" },
  "!": { precedence: 4, associativity: "left" },
  "^": { precedence: 3, associativity: "right" },
  "u-": { precedence: 3, associativity: "right" },
};

