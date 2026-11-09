import { USES } from "./schema.js";

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

export function validNumbers(rows, key) {
  return rows
    .map((row) => row[key])
    .filter(
      (x) =>
        x !== null && x !== undefined && x !== "" && Number.isFinite(Number(x)),
    )
    .map(Number);
}
export function quantile(numbers, p) {
  if (!numbers.length) return NaN;
  const sorted = [...numbers].sort((a, b) => a - b),
    index = (sorted.length - 1) * p,
    low = Math.floor(index),
    high = Math.ceil(index);
  return sorted[low] + (sorted[high] - sorted[low]) * (index - low);
}
export function describe(numbers) {
  if (!numbers.length) return null;
  const n = numbers.length,
    mean = numbers.reduce((s, x) => s + x, 0) / n,
    sorted = [...numbers].sort((a, b) => a - b);
  const variance =
    n > 1 ? numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1) : NaN;
  const counts = new Map();
  for (const x of sorted) counts.set(x, (counts.get(x) || 0) + 1);
  const most = Math.max(...counts.values()),
    modes =
      most > 1
        ? [...counts].filter(([, count]) => count === most).map(([x]) => x)
        : [];
  return {
    n,
    mean,
    median: quantile(numbers, 0.5),
    modes,
    min: sorted[0],
    max: sorted[n - 1],
    variance,
    sd: Math.sqrt(variance),
    cv:
      n > 1 && Math.abs(mean) > 1e-12
        ? (Math.sqrt(variance) / Math.abs(mean)) * 100
        : NaN,
    q1: quantile(numbers, 0.25),
    q3: quantile(numbers, 0.75),
    p10: quantile(numbers, 0.1),
    p90: quantile(numbers, 0.9),
  };
}
export function frequencies(rows) {
  const cat = USES.map((label) => ({
    label,
    count: rows.filter((r) => r.use === label).length,
  }));
  const total = cat.reduce((s, c) => s + c.count, 0);
  const nums = validNumbers(rows, "hoursAI").filter((x) => x >= 0 && x <= 10);
  const bins = Array.from({ length: 5 }, (_, i) => ({
    label: i === 4 ? "[8, 10]" : `[${i * 2}, ${i * 2 + 2})`,
    mark: 2 * i + 1,
    count: 0,
  }));
  for (const x of nums) bins[Math.min(4, Math.floor(x / 2))].count++;
  let cumulative = 0;
  for (const bin of bins) {
    cumulative += bin.count;
    bin.cumulative = cumulative;
  }
  return { cat, total, bins, n: nums.length };
}
export function paired(rows) {
  return rows
    .filter(
      (r) =>
        r.hoursAI !== null &&
        r.hoursAI !== undefined &&
        r.hoursAI !== "" &&
        r.grade !== null &&
        r.grade !== undefined &&
        r.grade !== "" &&
        Number.isFinite(Number(r.hoursAI)) &&
        Number.isFinite(Number(r.grade)),
    )
    .map((r) => ({ id: r.id, x: Number(r.hoursAI), y: Number(r.grade) }));
}
export function linearModel(pairs) {
  if (pairs.length < 3) return null;
  const n = pairs.length,
    mx = pairs.reduce((s, p) => s + p.x, 0) / n,
    my = pairs.reduce((s, p) => s + p.y, 0) / n;
  let xx = 0,
    yy = 0,
    xy = 0;
  for (const p of pairs) {
    xx += (p.x - mx) ** 2;
    yy += (p.y - my) ** 2;
    xy += (p.x - mx) * (p.y - my);
  }
  if (xx < 1e-12 || yy < 1e-12) return null;
  const slope = xy / xx,
    r = clamp(xy / Math.sqrt(xx * yy), -1, 1);
  return {
    n,
    r,
    r2: r * r,
    slope,
    intercept: my - slope * mx,
    minX: Math.min(...pairs.map((p) => p.x)),
    maxX: Math.max(...pairs.map((p) => p.x)),
    estimate(x) {
      return this.intercept + this.slope * x;
    },
  };
}

function logGamma(z) {
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5)
    return (
      Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z)
    );
  z--;
  let x = c[0];
  for (let i = 1; i < c.length; i++) x += c[i] / (z + i);
  const t = z + 7.5;
  return (
    0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
  );
}
function gammaQ(a, x) {
  if (x <= 0) return 1;
  const factor = Math.exp(-x + a * Math.log(x) - logGamma(a));
  if (x < a + 1) {
    let sum = 1 / a,
      term = sum;
    for (let i = 1; i <= 1000; i++) {
      term *= x / (a + i);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-14) break;
    }
    return clamp(1 - sum * factor, 0, 1);
  }
  let b = x + 1 - a,
    c = 1e30,
    d = 1 / (Math.abs(b) < 1e-30 ? 1e-30 : b),
    h = d;
  for (let i = 1; i <= 1000; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = b + an / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-14) break;
  }
  return clamp(h * factor, 0, 1);
}
export function chiSquare(rows) {
  const matrix = [
    [0, 0],
    [0, 0],
  ];
  for (const r of rows) {
    if (
      !["Sí", "No"].includes(r.verify) ||
      r.grade === null ||
      r.grade === undefined ||
      r.grade === "" ||
      !Number.isFinite(Number(r.grade))
    )
      continue;
    matrix[r.verify === "Sí" ? 0 : 1][Number(r.grade) >= 80 ? 0 : 1]++;
  }
  const rowTotals = matrix.map((r) => r[0] + r[1]),
    colTotals = [matrix[0][0] + matrix[1][0], matrix[0][1] + matrix[1][1]],
    n = rowTotals[0] + rowTotals[1];
  if (!n || rowTotals.some((x) => !x) || colTotals.some((x) => !x))
    return { matrix, rowTotals, colTotals, n, valid: false, calculable: false };
  const expected = matrix.map((r, i) =>
    r.map((_, j) => (rowTotals[i] * colTotals[j]) / n),
  );
  let statistic = 0,
    low = 0,
    minExpected = Infinity;
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      statistic += (matrix[i][j] - expected[i][j]) ** 2 / expected[i][j];
      if (expected[i][j] < 5) low++;
      minExpected = Math.min(minExpected, expected[i][j]);
    }
  return {
    matrix,
    rowTotals,
    colTotals,
    n,
    expected,
    statistic,
    df: 1,
    p: gammaQ(0.5, statistic / 2),
    low,
    minExpected,
    valid: low === 0,
    calculable: true,
    difference: matrix[0][0] / rowTotals[0] - matrix[1][0] / rowTotals[1],
  };
}
export const number = (x, d = 1) =>
  Number.isFinite(x)
    ? x.toLocaleString("es-ES", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      })
    : "—";
export const pValue = (p) => (p < 0.0001 ? "< 0,0001" : number(p, 4));
