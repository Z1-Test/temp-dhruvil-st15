import { Decimal } from "../decimal/decimal.ts";
import type { AngleMode } from "../types/tokens.ts";

export class DomainError extends Error {
  constructor(message: string = "Domain Error: Input out of range") {
    super(message);
    this.name = "DomainError";
  }
}

/**
 * Scientific mathematical operations supporting exact trigonometry, logarithms,
 * powers, roots, combinatorial functions, and constants.
 */
export class ScientificMath {
  public static readonly PI_STRING = "3.1415926535897932384626433832795028841971693993751";
  public static readonly E_STRING = "2.7182818284590452353602874713526624977572470936999";
  public static readonly PHI_STRING = "1.6180339887498948482045868343656381177203091798057";

  public static get PI(): Decimal {
    return Decimal.fromString(this.PI_STRING);
  }

  public static get E(): Decimal {
    return Decimal.fromString(this.E_STRING);
  }

  public static get PHI(): Decimal {
    return Decimal.fromString(this.PHI_STRING);
  }

  public static sin(x: Decimal, mode: AngleMode = "DEG"): Decimal {
    const rawVal = parseFloat(x.toString());

    if (mode === "DEG") {
      let deg = rawVal % 360;
      if (deg < 0) deg += 360;

      if (deg === 0 || deg === 180 || deg === 360) return Decimal.ZERO;
      if (deg === 30 || deg === 150) return Decimal.fromString("0.5");
      if (deg === 90) return Decimal.ONE;
      if (deg === 210 || deg === 330) return Decimal.fromString("-0.5");
      if (deg === 270) return Decimal.fromString("-1");

      const rad = deg * (Math.PI / 180);
      let res = Math.sin(rad);
      if (Math.abs(res) < 1e-15) return Decimal.ZERO;
      if (Math.abs(res - 0.5) < 1e-15) return Decimal.fromString("0.5");
      if (Math.abs(res + 0.5) < 1e-15) return Decimal.fromString("-0.5");
      return Decimal.fromNumber(this.cleanFloat(res));
    } else if (mode === "GRAD") {
      let grad = rawVal % 400;
      if (grad < 0) grad += 400;
      if (grad === 0 || grad === 200 || grad === 400) return Decimal.ZERO;
      if (grad === 100) return Decimal.ONE;
      if (grad === 300) return Decimal.fromString("-1");
      const rad = grad * (Math.PI / 200);
      return Decimal.fromNumber(this.cleanFloat(Math.sin(rad)));
    } else {
      // RAD mode
      if (Math.abs(rawVal) < 1e-15) return Decimal.ZERO;
      // Check exact multiples of pi
      const piVal = Math.PI;
      const piRatio = rawVal / piVal;
      if (Math.abs(piRatio - Math.round(piRatio)) < 1e-14) {
        return Decimal.ZERO;
      }
      if (Math.abs(piRatio - 0.5) < 1e-14 || Math.abs(piRatio - 2.5) < 1e-14) {
        return Decimal.ONE;
      }
      if (Math.abs(piRatio - 1.5) < 1e-14 || Math.abs(piRatio - 3.5) < 1e-14) {
        return Decimal.fromString("-1");
      }

      let res = Math.sin(rawVal);
      if (Math.abs(res) < 1e-15) return Decimal.ZERO;
      return Decimal.fromNumber(this.cleanFloat(res));
    }
  }

  public static cos(x: Decimal, mode: AngleMode = "DEG"): Decimal {
    const rawVal = parseFloat(x.toString());

    if (mode === "DEG") {
      let deg = rawVal % 360;
      if (deg < 0) deg += 360;

      if (deg === 0 || deg === 360) return Decimal.ONE;
      if (deg === 60 || deg === 300) return Decimal.fromString("0.5");
      if (deg === 90 || deg === 270) return Decimal.ZERO;
      if (deg === 120 || deg === 240) return Decimal.fromString("-0.5");
      if (deg === 180) return Decimal.fromString("-1");

      const rad = deg * (Math.PI / 180);
      let res = Math.cos(rad);
      if (Math.abs(res) < 1e-15) return Decimal.ZERO;
      return Decimal.fromNumber(this.cleanFloat(res));
    } else if (mode === "GRAD") {
      let grad = rawVal % 400;
      if (grad < 0) grad += 400;
      if (grad === 0 || grad === 400) return Decimal.ONE;
      if (grad === 100 || grad === 300) return Decimal.ZERO;
      if (grad === 200) return Decimal.fromString("-1");
      const rad = grad * (Math.PI / 200);
      return Decimal.fromNumber(this.cleanFloat(Math.cos(rad)));
    } else {
      // RAD mode
      const piVal = Math.PI;
      const piRatio = rawVal / piVal;
      if (Math.abs(piRatio - 0.5) < 1e-14 || Math.abs(piRatio - 1.5) < 1e-14) {
        return Decimal.ZERO;
      }
      if (Math.abs(piRatio - Math.round(piRatio)) < 1e-14) {
        const rounded = Math.round(piRatio);
        return rounded % 2 === 0 ? Decimal.ONE : Decimal.fromString("-1");
      }

      let res = Math.cos(rawVal);
      if (Math.abs(res) < 1e-15) return Decimal.ZERO;
      return Decimal.fromNumber(this.cleanFloat(res));
    }
  }

  public static tan(x: Decimal, mode: AngleMode = "DEG"): Decimal {
    const rawVal = parseFloat(x.toString());

    if (mode === "DEG") {
      let deg = rawVal % 180;
      if (deg < 0) deg += 180;

      if (deg === 90) {
        throw new DomainError("Domain Error: Input out of range (tan 90° undefined)");
      }
      if (deg === 0 || deg === 180) return Decimal.ZERO;
      if (deg === 45) return Decimal.ONE;
      if (deg === 135) return Decimal.fromString("-1");

      const rad = deg * (Math.PI / 180);
      let res = Math.tan(rad);
      if (Math.abs(res) < 1e-15) return Decimal.ZERO;
      return Decimal.fromNumber(this.cleanFloat(res));
    } else if (mode === "GRAD") {
      let grad = rawVal % 200;
      if (grad < 0) grad += 200;
      if (grad === 100) {
        throw new DomainError("Domain Error: Input out of range");
      }
      if (grad === 0 || grad === 200) return Decimal.ZERO;
      const rad = grad * (Math.PI / 200);
      return Decimal.fromNumber(this.cleanFloat(Math.tan(rad)));
    } else {
      const piRatio = rawVal / Math.PI;
      if (Math.abs(piRatio - 0.5) < 1e-14 || Math.abs(piRatio - 1.5) < 1e-14) {
        throw new DomainError("Domain Error: Input out of range");
      }
      let res = Math.tan(rawVal);
      if (Math.abs(res) < 1e-15) return Decimal.ZERO;
      return Decimal.fromNumber(this.cleanFloat(res));
    }
  }

  public static asin(x: Decimal, mode: AngleMode = "DEG"): Decimal {
    const val = parseFloat(x.toString());
    if (val < -1 || val > 1) {
      throw new DomainError("Domain Error: Input out of range");
    }

    let rad: number;
    if (val === 0) rad = 0;
    else if (val === 1) rad = Math.PI / 2;
    else if (val === -1) rad = -Math.PI / 2;
    else if (val === 0.5) rad = Math.PI / 6;
    else if (val === -0.5) rad = -Math.PI / 6;
    else rad = Math.asin(val);

    if (mode === "DEG") {
      let deg = rad * (180 / Math.PI);
      if (Math.abs(deg - Math.round(deg)) < 1e-10) deg = Math.round(deg);
      return Decimal.fromNumber(this.cleanFloat(deg));
    } else if (mode === "GRAD") {
      let grad = rad * (200 / Math.PI);
      if (Math.abs(grad - Math.round(grad)) < 1e-10) grad = Math.round(grad);
      return Decimal.fromNumber(this.cleanFloat(grad));
    }
    return Decimal.fromNumber(this.cleanFloat(rad));
  }

  public static acos(x: Decimal, mode: AngleMode = "DEG"): Decimal {
    const val = parseFloat(x.toString());
    if (val < -1 || val > 1) {
      throw new DomainError("Domain Error: Input out of range");
    }

    let rad: number;
    if (val === 1) rad = 0;
    else if (val === 0) rad = Math.PI / 2;
    else if (val === -1) rad = Math.PI;
    else if (val === 0.5) rad = Math.PI / 3;
    else if (val === -0.5) rad = (2 * Math.PI) / 3;
    else rad = Math.acos(val);

    if (mode === "DEG") {
      let deg = rad * (180 / Math.PI);
      if (Math.abs(deg - Math.round(deg)) < 1e-10) deg = Math.round(deg);
      return Decimal.fromNumber(this.cleanFloat(deg));
    } else if (mode === "GRAD") {
      let grad = rad * (200 / Math.PI);
      if (Math.abs(grad - Math.round(grad)) < 1e-10) grad = Math.round(grad);
      return Decimal.fromNumber(this.cleanFloat(grad));
    }
    return Decimal.fromNumber(this.cleanFloat(rad));
  }

  public static atan(x: Decimal, mode: AngleMode = "DEG"): Decimal {
    const val = parseFloat(x.toString());
    let rad = Math.atan(val);
    if (val === 0) rad = 0;
    if (val === 1) rad = Math.PI / 4;
    if (val === -1) rad = -Math.PI / 4;

    if (mode === "DEG") {
      let deg = rad * (180 / Math.PI);
      if (Math.abs(deg - Math.round(deg)) < 1e-10) deg = Math.round(deg);
      return Decimal.fromNumber(this.cleanFloat(deg));
    } else if (mode === "GRAD") {
      let grad = rad * (200 / Math.PI);
      if (Math.abs(grad - Math.round(grad)) < 1e-10) grad = Math.round(grad);
      return Decimal.fromNumber(this.cleanFloat(grad));
    }
    return Decimal.fromNumber(this.cleanFloat(rad));
  }

  public static sinh(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    return Decimal.fromNumber(this.cleanFloat(Math.sinh(val)));
  }

  public static cosh(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    return Decimal.fromNumber(this.cleanFloat(Math.cosh(val)));
  }

  public static tanh(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    return Decimal.fromNumber(this.cleanFloat(Math.tanh(val)));
  }

  public static asinh(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    return Decimal.fromNumber(this.cleanFloat(Math.asinh(val)));
  }

  public static acosh(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    if (val < 1) {
      throw new DomainError("Domain Error: Input out of range");
    }
    return Decimal.fromNumber(this.cleanFloat(Math.acosh(val)));
  }

  public static atanh(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    if (val <= -1 || val >= 1) {
      throw new DomainError("Domain Error: Input out of range");
    }
    return Decimal.fromNumber(this.cleanFloat(Math.atanh(val)));
  }

  public static ln(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    if (val <= 0) {
      throw new DomainError("Domain Error: Input out of range");
    }
    if (x.equals(Decimal.ONE)) return Decimal.ZERO;

    // Check exact powers of e
    if (Math.abs(val - Math.E) < 1e-10) return Decimal.ONE;
    if (Math.abs(val - Math.E ** 2) < 1e-8) return Decimal.fromString("2");
    if (Math.abs(val - Math.E ** 3) < 1e-7) return Decimal.fromString("3");
    if (Math.abs(val - Math.E ** 4) < 1e-6) return Decimal.fromString("4");

    let res = Math.log(val);
    if (Math.abs(res - Math.round(res)) < 1e-12) res = Math.round(res);
    return Decimal.fromNumber(this.cleanFloat(res));
  }

  public static log10(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    if (val <= 0) {
      throw new DomainError("Domain Error: Input out of range");
    }
    if (x.equals(Decimal.ONE)) return Decimal.ZERO;

    const s = x.toString();
    if (/^10+$/.test(s)) {
      return new Decimal(BigInt(s.length - 1), 0);
    }

    let res = Math.log10(val);
    if (Math.abs(res - Math.round(res)) < 1e-12) res = Math.round(res);
    return Decimal.fromNumber(this.cleanFloat(res));
  }

  public static log2(x: Decimal): Decimal {
    const val = parseFloat(x.toString());
    if (val <= 0) {
      throw new DomainError("Domain Error: Input out of range");
    }
    if (x.equals(Decimal.ONE)) return Decimal.ZERO;

    let res = Math.log2(val);
    if (Math.abs(res - Math.round(res)) < 1e-12) res = Math.round(res);
    return Decimal.fromNumber(this.cleanFloat(res));
  }

  public static sqrt(x: Decimal): Decimal {
    if (x.isNegative()) {
      throw new DomainError("Domain Error: Negative root undefined in real mode");
    }
    if (x.isZero()) return Decimal.ZERO;
    const val = parseFloat(x.toString());
    let res = Math.sqrt(val);
    if (Math.abs(res - Math.round(res)) < 1e-12) res = Math.round(res);
    return Decimal.fromNumber(this.cleanFloat(res));
  }

  public static cbrt(x: Decimal): Decimal {
    if (x.isZero()) return Decimal.ZERO;
    const val = parseFloat(x.toString());
    let res = Math.cbrt(val);
    if (Math.abs(res - Math.round(res)) < 1e-12) res = Math.round(res);
    return Decimal.fromNumber(this.cleanFloat(res));
  }

  public static pow(base: Decimal, exponent: Decimal): Decimal {
    const b = parseFloat(base.toString());
    const e = parseFloat(exponent.toString());

    if (b === 0 && e <= 0) {
      throw new DomainError("Cannot divide by zero");
    }
    if (e === 0) return Decimal.ONE;
    if (b === 0) return Decimal.ZERO;

    if (b < 0 && !Number.isInteger(e)) {
      throw new DomainError("Domain Error: Negative base with fractional exponent");
    }

    // Exact integer powers for small integers
    if (Number.isInteger(b) && Number.isInteger(e) && Math.abs(e) <= 100 && Math.abs(b) <= 1000) {
      if (e > 0) {
        const bigB = BigInt(Math.trunc(b));
        const bigE = BigInt(Math.trunc(e));
        const res = bigB ** bigE;
        if (res.toString().length > 30) {
          return this.fromBigIntScientific(res);
        }
        return new Decimal(res, 0);
      } else {
        const bigB = BigInt(Math.trunc(b));
        const bigE = BigInt(Math.trunc(-e));
        const denom = bigB ** bigE;
        return Decimal.ONE.divide(new Decimal(denom, 0));
      }
    }

    let res = Math.pow(b, e);
    if (!Number.isFinite(res)) {
      throw new DomainError("Overflow / Result out of range");
    }
    if (Math.abs(res - Math.round(res)) < 1e-12) res = Math.round(res);
    return Decimal.fromNumber(this.cleanFloat(res));
  }

  public static factorial(nDec: Decimal): Decimal {
    const s = nDec.toString();
    if (nDec.isNegative() || s.includes(".")) {
      throw new DomainError("Domain Error: Non-negative integer required");
    }
    const n = parseInt(s, 10);
    if (Number.isNaN(n) || n > 10000) {
      throw new DomainError("Domain Error: Input out of range (n <= 10000)");
    }
    if (n === 0 || n === 1) return Decimal.ONE;

    let res = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
      res *= i;
    }

    if (n <= 20) {
      return new Decimal(res, 0);
    }
    return this.fromBigIntScientific(res);
  }

  public static nCr(nDec: Decimal, rDec: Decimal): Decimal {
    const nStr = nDec.toString();
    const rStr = rDec.toString();
    if (nDec.isNegative() || rDec.isNegative() || nStr.includes(".") || rStr.includes(".")) {
      throw new DomainError("Domain Error: Input out of range");
    }
    const n = parseInt(nStr, 10);
    let r = parseInt(rStr, 10);
    if (r > n) {
      throw new DomainError("Domain Error: Input out of range");
    }
    if (r === 0 || r === n) return Decimal.ONE;
    if (r > n - r) r = n - r;

    let num = 1n;
    let den = 1n;
    for (let i = 1n; i <= BigInt(r); i++) {
      num *= BigInt(n) - i + 1n;
      den *= i;
    }
    return new Decimal(num / den, 0);
  }

  public static nPr(nDec: Decimal, rDec: Decimal): Decimal {
    const nStr = nDec.toString();
    const rStr = rDec.toString();
    if (nDec.isNegative() || rDec.isNegative() || nStr.includes(".") || rStr.includes(".")) {
      throw new DomainError("Domain Error: Input out of range");
    }
    const n = parseInt(nStr, 10);
    const r = parseInt(rStr, 10);
    if (r > n) {
      throw new DomainError("Domain Error: Input out of range");
    }
    if (r === 0) return Decimal.ONE;

    let num = 1n;
    for (let i = 0n; i < BigInt(r); i++) {
      num *= BigInt(n) - i;
    }
    return new Decimal(num, 0);
  }

  public static fromBigIntScientific(val: bigint): Decimal {
    const str = val.toString();
    if (str.length <= 16) {
      return new Decimal(val, 0);
    }
    const exp = str.length - 1;
    const sig = str[0] + "." + str.slice(1, 16);
    const num = parseFloat(sig);
    const sciStr = `${num}e+${exp}`;
    return Decimal.fromString(sciStr);
  }

  private static cleanFloat(num: number): number {
    if (Number.isInteger(num)) return num;
    const rounded = Math.round(num * 1e14) / 1e14;
    return rounded;
  }
}
