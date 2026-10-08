export class DivisionByZeroError extends Error {
  constructor(message: string = "Cannot divide by zero") {
    super(message);
    this.name = "DivisionByZeroError";
  }
}

/**
 * Arbitrary-precision decimal arithmetic using native JavaScript BigInt.
 * Eliminates IEEE-754 binary floating-point drift (e.g. 0.1 + 0.2 === 0.3).
 */
export class Decimal {
  private readonly coefficient: bigint;
  private readonly scale: number;

  public static readonly DEFAULT_PRECISION = 34;

  constructor(coefficient: bigint, scale: number = 0) {
    if (coefficient === 0n) {
      this.coefficient = 0n;
      this.scale = 0;
    } else {
      // Normalize: strip unnecessary trailing zeros from scale
      let coeff = coefficient;
      let s = scale;
      while (s > 0 && coeff % 10n === 0n) {
        coeff /= 10n;
        s -= 1;
      }
      this.coefficient = coeff;
      this.scale = s;
    }
  }

  public static get ZERO(): Decimal {
    return new Decimal(0n, 0);
  }

  public static get ONE(): Decimal {
    return new Decimal(1n, 0);
  }

  public static get TEN(): Decimal {
    return new Decimal(10n, 0);
  }

  public static fromString(str: string): Decimal {
    const trimmed = str.trim();
    if (!trimmed) {
      return Decimal.ZERO;
    }

    // Handle optional leading plus or minus
    let isNegative = false;
    let s = trimmed;
    if (s.startsWith("-")) {
      isNegative = true;
      s = s.slice(1);
    } else if (s.startsWith("+")) {
      s = s.slice(1);
    }

    // Handle scientific notation e.g. 1.23e-4 or 5e6
    const eIndex = s.toLowerCase().indexOf("e");
    if (eIndex !== -1) {
      const baseStr = s.slice(0, eIndex);
      const expStr = s.slice(eIndex + 1);
      const exp = parseInt(expStr, 10);
      if (Number.isNaN(exp)) {
        throw new Error(`Invalid scientific exponent: "${str}"`);
      }
      const baseDec = Decimal.fromString((isNegative ? "-" : "") + baseStr);
      if (exp >= 0) {
        return baseDec.multiply(new Decimal(10n ** BigInt(exp), 0));
      } else {
        return baseDec.divide(new Decimal(10n ** BigInt(-exp), 0));
      }
    }

    const dotIndex = s.indexOf(".");
    if (dotIndex === -1) {
      if (!/^\d+$/.test(s)) {
        throw new Error(`Invalid decimal number: "${str}"`);
      }
      const coeff = BigInt(s);
      return new Decimal(isNegative ? -coeff : coeff, 0);
    }

    const integerPart = s.slice(0, dotIndex);
    const fractionalPart = s.slice(dotIndex + 1);

    if ((!integerPart && !fractionalPart) || !/^\d*$/.test(integerPart) || !/^\d*$/.test(fractionalPart)) {
      throw new Error(`Invalid decimal number: "${str}"`);
    }

    const fullDigits = (integerPart || "0") + fractionalPart;
    const coeff = BigInt(fullDigits);
    const scale = fractionalPart.length;

    return new Decimal(isNegative ? -coeff : coeff, scale);
  }

  public static fromNumber(num: number): Decimal {
    if (!Number.isFinite(num)) {
      throw new Error(`Cannot create Decimal from non-finite number: ${num}`);
    }
    return Decimal.fromString(num.toString());
  }

  public isZero(): boolean {
    return this.coefficient === 0n;
  }

  public isNegative(): boolean {
    return this.coefficient < 0n;
  }

  public negate(): Decimal {
    return new Decimal(-this.coefficient, this.scale);
  }

  public abs(): Decimal {
    return this.coefficient < 0n ? this.negate() : this;
  }

  public add(other: Decimal): Decimal {
    const maxScale = Math.max(this.scale, other.scale);
    const coeffA = this.coefficient * 10n ** BigInt(maxScale - this.scale);
    const coeffB = other.coefficient * 10n ** BigInt(maxScale - other.scale);
    return new Decimal(coeffA + coeffB, maxScale);
  }

  public subtract(other: Decimal): Decimal {
    return this.add(other.negate());
  }

  public multiply(other: Decimal): Decimal {
    const newCoeff = this.coefficient * other.coefficient;
    const newScale = this.scale + other.scale;
    return new Decimal(newCoeff, newScale);
  }

  public divide(other: Decimal, precision: number = Decimal.DEFAULT_PRECISION): Decimal {
    if (other.isZero()) {
      throw new DivisionByZeroError();
    }
    if (this.isZero()) {
      return Decimal.ZERO;
    }

    // Perform integer division scaled to requested precision + 1 for half-up rounding
    const extraScale = precision + other.scale - this.scale + 1;
    let numerator: bigint;
    let denominator: bigint = other.coefficient < 0n ? -other.coefficient : other.coefficient;
    let isNeg = (this.coefficient < 0n) !== (other.coefficient < 0n);

    const absThis = this.coefficient < 0n ? -this.coefficient : this.coefficient;

    if (extraScale >= 0) {
      numerator = absThis * (10n ** BigInt(extraScale));
    } else {
      numerator = absThis / (10n ** BigInt(-extraScale));
    }

    let quotient = numerator / denominator;
    const lastDigit = quotient % 10n;
    quotient /= 10n;

    // Half-up rounding
    if (lastDigit >= 5n) {
      quotient += 1n;
    }

    const finalCoeff = isNeg ? -quotient : quotient;
    return new Decimal(finalCoeff, precision);
  }

  public compare(other: Decimal): number {
    const maxScale = Math.max(this.scale, other.scale);
    const coeffA = this.coefficient * 10n ** BigInt(maxScale - this.scale);
    const coeffB = other.coefficient * 10n ** BigInt(maxScale - other.scale);
    if (coeffA < coeffB) return -1;
    if (coeffA > coeffB) return 1;
    return 0;
  }

  public equals(other: Decimal): boolean {
    return this.compare(other) === 0;
  }

  public toString(): string {
    if (this.isZero()) {
      return "0";
    }

    const isNeg = this.coefficient < 0n;
    const absCoeff = isNeg ? -this.coefficient : this.coefficient;
    let s = absCoeff.toString();

    if (this.scale === 0 && s.length > 20) {
      const exp = s.length - 1;
      const sig = (s[0] + "." + s.slice(1, 16)).replace(/0+$/, "").replace(/\.$/, "");
      return `${isNeg ? "-" : ""}${sig}e+${exp}`;
    }

    if (this.scale === 0) {
      return (isNeg ? "-" : "") + s;
    }


    if (s.length <= this.scale) {
      s = s.padStart(this.scale + 1, "0");
    }

    const intPart = s.slice(0, s.length - this.scale);
    let fracPart = s.slice(s.length - this.scale);

    // Strip trailing zeros in fraction
    fracPart = fracPart.replace(/0+$/, "");

    if (fracPart.length === 0) {
      return (isNeg ? "-" : "") + intPart;
    }

    return `${isNeg ? "-" : ""}${intPart}.${fracPart}`;
  }

  public toFormattedString(): string {
    const raw = this.toString();
    const parts = raw.split(".");
    // Insert commas into integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
}
