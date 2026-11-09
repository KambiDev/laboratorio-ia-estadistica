import React from "react";
import { Section, Panel, Explain, Table } from "../components/ui.jsx";
import { number, pValue } from "../domain/statistics.js";

export default function Tests({ chi, pairs, model, strength }) {
  return (
    <Section
      id="pruebas"
      index="05"
      title="Poner a prueba"
      subtitle="Asociación entre categorías; relación lineal entre magnitudes; predicciones dentro del rango observado."
    >
      <Panel
        title="Verificar respuestas × rendimiento alto"
        kicker="TABLA 2 × 2 / CHI-CUADRADO"
      >
        <div className="hypotheses">
          <p>
            <b>H₀</b> Verificación y rendimiento alto son independientes.
          </p>
          <p>
            <b>H₁</b> Existe asociación entre ambas variables.
          </p>
        </div>
        <Table
          headers={["VERIFICA", "PROMEDIO ≥ 80", "PROMEDIO < 80", "TOTAL"]}
          rows={[
            ["Sí", ...chi.matrix[0], chi.rowTotals[0]],
            ["No", ...chi.matrix[1], chi.rowTotals[1]],
            ["Total", ...chi.colTotals, chi.n],
          ]}
        />
        {chi.calculable ? (
          <>
            <div className="result-line">
              <div>
                <small>ESTADÍSTICO</small>
                <b>χ² = {number(chi.statistic, 3)}</b>
              </div>
              <div>
                <small>GRADOS DE LIBERTAD</small>
                <b>{chi.df}</b>
              </div>
              <div>
                <small>VALOR p</small>
                <b>{pValue(chi.p)}</b>
              </div>
              <div>
                <small>ESPERADA MÍNIMA</small>
                <b>{number(chi.minExpected, 2)}</b>
              </div>
            </div>
            <p className="detail">
              Esperadas, alto / menor: Sí{" "}
              {chi.expected[0].map((x) => number(x, 2)).join(" / ")}; No{" "}
              {chi.expected[1].map((x) => number(x, 2)).join(" / ")}. {chi.low}{" "}
              de 4 celdas esperadas por debajo de 5.
            </p>
          </>
        ) : (
          <p className="warning">
            No calculable: se necesitan ambas categorías en las filas y en las
            columnas.
          </p>
        )}
        <Explain>
          χ² compara los conteos observados con los esperados bajo
          independencia; los grados de libertad son (2 − 1) × (2 − 1) = 1.{" "}
          {chi.calculable
            ? chi.valid
              ? `La diferencia descriptiva en rendimiento alto es de ${number(chi.difference * 100, 1)} puntos porcentuales. Con α = 0,05, ${chi.p < 0.05 ? "hay evidencia de asociación" : "no se rechaza la independencia; esto no demuestra ausencia de relación"}.`
              : `${chi.low} frecuencias esperadas son menores de 5: el valor p aproximado no es fiable. Una prueba exacta de Fisher o una muestra mayor serían alternativas.`
            : "Al filtrar, desapareció una categoría necesaria: amplía la selección."}{" "}
          Este contraste no ajusta otros factores ni permite atribuir
          causalidad.
        </Explain>
      </Panel>
      <div className="two-col spaced">
        <Panel
          title="Correlación de Pearson"
          kicker="X: HORAS IA / Y: PROMEDIO"
        >
          <div className="giant-stat">
            {model ? number(model.r, 3) : "—"}
            <span>r / {pairs.length} pares completos</span>
          </div>
          <Explain>
            Pearson mide dirección y fuerza de la asociación lineal.{" "}
            {model
              ? `La relación aquí es ${model.r >= 0 ? "positiva" : "negativa"} y ${strength}.`
              : "Se requieren al menos tres pares y variación en ambas variables."}{" "}
            Los valores atípicos y relaciones curvas pueden afectar r.
            Correlación no demuestra causalidad ni controla las horas de
            estudio.
          </Explain>
        </Panel>
        <Panel
          title="Regresión lineal simple"
          kicker="PROMEDIO ESTIMADO / HORAS IA"
        >
          <div className="formula">
            {model
              ? `Ŷ = ${number(model.intercept, 2)} ${model.slope >= 0 ? "+" : "−"} ${number(Math.abs(model.slope), 2)} × X`
              : "No estimable"}
          </div>
          <div className="formula-meta">
            R² <strong>{model ? number(model.r2, 3) : "—"}</strong> · rango X:{" "}
            {model ? `${number(model.minX)}–${number(model.maxX)} h` : "—"}
            {model && (
              <>
                <br />
                Ejemplo dentro del rango: a{" "}
                {number(Math.max(model.minX, Math.min(4, model.maxX)))} h,
                promedio estimado ={" "}
                {number(
                  model.estimate(Math.max(model.minX, Math.min(4, model.maxX))),
                  2,
                )}{" "}
                puntos.
              </>
            )}
          </div>
          <Explain>
            {model
              ? `La pendiente estima ${number(model.slope, 2)} puntos de diferencia promedio por hora de IA. El intercepto estima el promedio a cero horas${model.minX > 0 ? ", fuera del rango observado" : ""}. La recta resume ${number(model.r2 * 100, 1)} % de la variación muestral del promedio. Predice prudentemente solo entre ${number(model.minX)} y ${number(model.maxX)} horas, sin implicar un efecto causal.`
              : "Sin variación suficiente, no puede ajustarse una recta ni calcularse R²."}
          </Explain>
        </Panel>
      </div>
      <Panel
        title="Observado frente a estimado"
        kicker="PRIMEROS 12 PARES VISIBLES"
        className="spaced"
      >
        <Table
          headers={["ID", "HORAS IA", "OBSERVADO", "ESTIMADO", "RESIDUO"]}
          rows={
            model
              ? pairs
                  .slice(0, 12)
                  .map((p) => [
                    p.id,
                    number(p.x),
                    number(p.y),
                    number(model.estimate(p.x)),
                    number(p.y - model.estimate(p.x)),
                  ])
              : []
          }
          empty="Sin modelo estimable para la selección."
        />
        <Explain>
          El residuo es observado menos estimado: indica cuánto se aparta cada
          estudiante simulado de la recta. Una predicción es una aproximación al
          promedio condicional, no una garantía para una persona concreta.
        </Explain>
      </Panel>
    </Section>
  );
}
