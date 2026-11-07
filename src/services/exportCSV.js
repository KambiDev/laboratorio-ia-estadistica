import { FIELDS } from "../domain/schema.js";

export function toCSV(rows) {
  return [
    FIELDS.map((field) => field.label),
    ...rows.map((row) => FIELDS.map((field) => row[field.key])),
  ]
    .map((line) =>
      line
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\r\n");
}

export function exportCSV(rows) {
  const url = URL.createObjectURL(
    new Blob(["\ufeff", toCSV(rows)], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ia_rendimiento_datos_sinteticos_visibles.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
