import { FIELDS } from "./schema.js";
import {
  chiSquare,
  describe,
  frequencies,
  linearModel,
  paired,
  validNumbers,
} from "./statistics.js";

const numericFields = new Set([
  "semester",
  "hoursAI",
  "hoursStudy",
  "sleep",
  "grade",
  "courses",
]);

// Pure selectors: the same rows power the table, summaries, tests and charts.
export function selectVisible(
  records,
  {
    query = "",
    useFilter = "",
    verifyFilter = "",
    sort = { key: "id", direction: 1 },
  } = {},
) {
  const text = query.trim().toLocaleLowerCase("es");
  return records
    .filter(
      (row) =>
        (!useFilter || row.use === useFilter) &&
        (!verifyFilter || row.verify === verifyFilter) &&
        (!text ||
          FIELDS.some((field) =>
            String(row[field.key] ?? "")
              .toLocaleLowerCase("es")
              .includes(text),
          )),
    )
    .sort((a, b) => {
      const x = a[sort.key],
        y = b[sort.key];
      const comparison = numericFields.has(sort.key)
        ? Number(x) - Number(y)
        : String(x).localeCompare(String(y), "es", { numeric: true });
      return comparison * sort.direction;
    });
}

export function analyze(rows) {
  const distribution = frequencies(rows);
  const pairs = paired(rows);
  const model = linearModel(pairs);
  const chi = chiSquare(rows);
  const grades = validNumbers(rows, "grade");
  const hours = validNumbers(rows, "hoursAI");
  const groupMeans = ["Sí", "No"].map((label) => {
    const data = validNumbers(
      rows.filter((row) => row.verify === label),
      "grade",
    );
    return { label, n: data.length, mean: describe(data)?.mean ?? 0 };
  });
  const dominant = distribution.total
    ? distribution.cat.reduce((a, b) => (a.count >= b.count ? a : b)).label
    : "—";
  const magnitude = model ? Math.abs(model.r) : null;
  const strength =
    magnitude === null
      ? null
      : magnitude < 0.2
        ? "muy débil"
        : magnitude < 0.4
          ? "débil"
          : magnitude < 0.6
            ? "moderada"
            : magnitude < 0.8
              ? "fuerte"
              : "muy fuerte";
  return {
    distribution,
    pairs,
    model,
    chi,
    grades,
    hours,
    groupMeans,
    gradeStats: describe(grades),
    dominant,
    strength,
  };
}
