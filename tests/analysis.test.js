import test from "node:test";
import assert from "node:assert/strict";
import { FIELDS } from "../src/domain/schema.js";
import { generateSample } from "../src/domain/sample.js";
import { analyze, selectVisible } from "../src/domain/analysis.js";
import {
  chiSquare,
  describe,
  linearModel,
  paired,
  quantile,
  validNumbers,
} from "../src/domain/statistics.js";
import { toCSV } from "../src/services/exportCSV.js";

test("la muestra inicial es reproducible y conserva el esquema de la encuesta", () => {
  const first = generateSample();
  assert.deepEqual(first, generateSample());
  assert.equal(first.length, 72);
  assert.equal(FIELDS.length, 13); // 12 preguntas + identificador
  assert.ok(
    first.every((row) =>
      FIELDS.every((field) => Object.hasOwn(row, field.key)),
    ),
  );
  assert.notDeepEqual(first, generateSample(123));
});

test("filtrado y ordenamiento preservan los datos de origen", () => {
  const original = generateSample();
  const rows = selectVisible(original, {
    useFilter: "Estudio",
    verifyFilter: "Sí",
    sort: { key: "grade", direction: -1 },
  });
  assert.ok(rows.length > 0 && rows.length < original.length);
  assert.ok(rows.every((row) => row.use === "Estudio" && row.verify === "Sí"));
  assert.ok(rows.every((row, i) => i === 0 || rows[i - 1].grade >= row.grade));
  assert.equal(original[0].id, "E001");
  assert.deepEqual(
    selectVisible(original, { query: "identificador que no existe" }),
    [],
  );
});

test("distribuciones, modelo y tabla cruzada se recalculan desde las filas visibles", () => {
  const rows = selectVisible(generateSample(321), { useFilter: "Redacción" });
  const result = analyze(rows);
  assert.equal(result.distribution.total, rows.length);
  assert.equal(
    result.distribution.bins.reduce((sum, bin) => sum + bin.count, 0),
    result.distribution.n,
  );
  assert.equal(result.chi.n, rows.length);
  assert.equal(result.gradeStats.n, rows.length);
  assert.ok(Math.abs(result.model.r2 - result.model.r ** 2) < 1e-12);
});

test("descriptiva muestral, cuartiles y percentiles", () => {
  const values = [1, 2, 3, 4, 5];
  const s = describe(values);
  assert.equal(s.mean, 3);
  assert.equal(s.median, 3);
  assert.equal(s.variance, 2.5);
  assert.equal(s.q1, 2);
  assert.equal(s.q3, 4);
  assert.equal(quantile(values, 0.1), 1.4);
  assert.equal(describe([]), null);
  assert.ok(Number.isNaN(describe([1]).variance));
  assert.deepEqual(
    validNumbers([{ grade: null }, { grade: "" }, { grade: 80 }], "grade"),
    [80],
  );
});

test("regresión conocida, prueba chi-cuadrado y muestras degeneradas", () => {
  const model = linearModel([
    { x: 0, y: 1 },
    { x: 1, y: 3 },
    { x: 2, y: 5 },
  ]);
  assert.equal(model.slope, 2);
  assert.equal(model.intercept, 1);
  assert.equal(model.r2, 1);
  assert.equal(model.estimate(1.5), 4);
  assert.equal(linearModel([{ x: 1, y: 2 }]), null);
  assert.equal(
    linearModel([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ]),
    null,
  );
  assert.equal(chiSquare([]).calculable, false);
  assert.equal(paired([{ id: "A", hoursAI: null, grade: 80 }]).length, 0);
  const rows = [
    ...Array.from({ length: 8 }, () => ({ verify: "Sí", grade: 90 })),
    ...Array.from({ length: 2 }, () => ({ verify: "Sí", grade: 50 })),
    ...Array.from({ length: 2 }, () => ({ verify: "No", grade: 90 })),
    ...Array.from({ length: 8 }, () => ({ verify: "No", grade: 50 })),
  ];
  const chi = chiSquare(rows);
  assert.equal(chi.statistic, 7.2);
  assert.equal(chi.df, 1);
  assert.ok(chi.p < 0.01);
  assert.equal(chi.valid, true);
});

test("CSV exporta únicamente las filas recibidas, con comillas y separadores escapados", () => {
  const rows = [{ ...generateSample()[0], use: 'Estudio, "asistido"' }];
  const csv = toCSV(rows);
  assert.equal(csv.split("\r\n").length, 2);
  assert.ok(csv.includes('"Estudio, ""asistido"""'));
  assert.ok(csv.startsWith('"ID","Semestre"'));
  assert.equal(toCSV([]).split("\r\n").length, 1);
});
