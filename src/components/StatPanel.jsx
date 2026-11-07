import React from "react";
import { describe, number } from "../domain/statistics.js";
import { Panel, Explain } from "./ui.jsx";

export default function StatPanel({ title, unit, data }) {
  const s = describe(data);
  if (!s)
    return (
      <Panel kicker="SIN DATOS" title={title}>
        <p>No hay observaciones válidas en la selección.</p>
        <Explain>
          Las medidas descriptivas requieren al menos un valor; para varianza y
          desviación muestrales se necesitan dos.
        </Explain>
      </Panel>
    );
  const items = [
    ["Valores válidos", number(s.n, 0)],
    ["Media", number(s.mean, 2)],
    ["Mediana · P50", number(s.median, 2)],
    [
      "Moda",
      s.modes.length
        ? s.modes
            .slice(0, 5)
            .map((x) => number(x, 1))
            .join(" / ") + (s.modes.length > 5 ? "…" : "")
        : "Sin moda",
    ],
    ["Mínimo / máximo", `${number(s.min)} / ${number(s.max)}`],
    ["Rango", number(s.max - s.min, 2)],
    ["Varianza muestral", number(s.variance, 2)],
    ["Desviación muestral", number(s.sd, 2)],
    ["Q1 / Q3", `${number(s.q1, 2)} / ${number(s.q3, 2)}`],
    ["P10 / P90", `${number(s.p10, 2)} / ${number(s.p90, 2)}`],
  ];
  return (
    <Panel kicker={unit} title={title}>
      <dl className="stat-list">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <Explain>
        La media ({number(s.mean, 2)} {unit}) resume el centro; la mediana
        divide la selección en dos. Q1 y Q3 contienen el 50 % central. La
        desviación estándar ({number(s.sd, 2)} {unit}) expresa dispersión en la
        unidad original; la varianza se expresa en unidades al cuadrado. Estas
        medidas describen solo las filas visibles, no una población real.
      </Explain>
    </Panel>
  );
}
