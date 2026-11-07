import React from "react";
import { Section, Panel, Explain, Table } from "../components/ui.jsx";
import { USES } from "../domain/schema.js";
import { number } from "../domain/statistics.js";
import {
  BarChart,
  Histogram,
  PieChart,
  ScatterChart,
} from "../components/Charts.jsx";

export default function Graphics({
  distribution,
  dominant,
  pairs,
  model,
  groupMeans,
}) {
  return (
    <Section
      id="graficos"
      index="06"
      title="Ver los patrones"
      subtitle="Gráficos SVG calculados a partir de las mismas filas visibles que las tablas."
    >
      <div className="two-col chart-grid-layout">
        <Panel title="Uso principal" kicker="BARRAS / ESTUDIANTES">
          {distribution.total ? (
            <BarChart
              labels={USES}
              values={distribution.cat.map((c) => c.count)}
            />
          ) : (
            <p className="chart-empty">Sin datos visibles.</p>
          )}
          <p className="chart-caption">
            {distribution.total
              ? `${dominant} reúne más estudiantes en la selección.`
              : "Limpia los filtros para mostrar el gráfico."}
          </p>
        </Panel>
        <Panel title="Horas semanales de IA" kicker="HISTOGRAMA / ESTUDIANTES">
          {distribution.n ? (
            <Histogram bins={distribution.bins} />
          ) : (
            <p className="chart-empty">Sin horas válidas.</p>
          )}
          <p className="chart-caption">
            Las barras contiguas cuentan estudiantes por intervalo de dos horas.
          </p>
        </Panel>
        <Panel title="Frecuencias por marca" kicker="POLÍGONO / ESTUDIANTES">
          {distribution.n ? (
            <Histogram bins={distribution.bins} polygon />
          ) : (
            <p className="chart-empty">Sin horas válidas.</p>
          )}
          <p className="chart-caption">
            Las marcas de clase unen frecuencias, no observaciones individuales.
          </p>
        </Panel>
        <Panel title="Composición de uso" kicker="CIRCULAR / PORCENTAJE">
          {distribution.total ? (
            <PieChart
              categories={distribution.cat}
              total={distribution.total}
            />
          ) : (
            <p className="chart-empty">Sin categorías válidas.</p>
          )}
          <p className="chart-caption">
            Cada sector representa una proporción de los usos principales.
          </p>
        </Panel>
        <Panel title="Horas IA × promedio" kicker="DISPERSIÓN / REGRESIÓN">
          {pairs.length ? (
            <ScatterChart pairs={pairs} model={model} />
          ) : (
            <p className="chart-empty">Sin pares completos.</p>
          )}
          <p className="chart-caption">
            Cada punto es un estudiante simulado; la línea muestra la tendencia
            estimada{" "}
            {model
              ? "dentro del rango observado"
              : "cuando el modelo es estimable"}
            .
          </p>
        </Panel>
        <Panel
          title="Promedio por verificación"
          kicker="COMPARACIÓN / PUNTOS DE 100"
        >
          {groupMeans.some((g) => g.n) ? (
            <BarChart
              labels={["Sí", "No"]}
              values={groupMeans.map((g) => g.mean)}
              ceiling={100}
              unit="promedio (puntos)"
            />
          ) : (
            <p className="chart-empty">Sin promedios válidos.</p>
          )}
          <p className="chart-caption">
            {groupMeans.every((g) => g.n)
              ? `La diferencia descriptiva es ${number(groupMeans[0].mean - groupMeans[1].mean, 1)} puntos (n = ${groupMeans[0].n} frente a ${groupMeans[1].n}); no es un efecto causal.`
              : "Falta al menos un grupo: evita comparar una barra con un grupo vacío."}
          </p>
        </Panel>
      </div>
      <div className="section-explain">
        <Explain>
          Las barras comparan cantidades; histograma y polígono muestran la
          distribución de horas; el circular muestra proporciones. La dispersión
          y la recta revelan una tendencia aproximada. Una visualización tampoco
          prueba que cambiar el uso de IA cambie las calificaciones.
        </Explain>
      </div>
    </Section>
  );
}
