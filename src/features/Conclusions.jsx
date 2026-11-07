import React from "react";
import { Section, Panel, Explain, Table } from "../components/ui.jsx";
import { number } from "../domain/statistics.js";

export default function Conclusions({ visibleCount, gradeStats, model, chi }) {
  return (
    <Section
      id="interpretaciones"
      index="07"
      title="Lo que sí sabemos"
      subtitle="Un cierre que cambia con la muestra visible y explicita sus límites."
    >
      <Panel
        title="Lectura crítica de esta selección"
        kicker="CONCLUSIONES / NO CAUSALIDAD"
      >
        <div className="conclusion">
          <p>
            Hay <strong>{visibleCount}</strong> registros visibles
            {gradeStats ? (
              <>
                {" "}
                y un promedio académico medio de{" "}
                <strong>{number(gradeStats.mean, 1)} puntos</strong>
              </>
            ) : (
              <> sin promedios válidos</>
            )}
            .{" "}
            {model ? (
              <>
                La asociación lineal entre horas de IA y promedio es{" "}
                <strong>
                  {model.r >= 0 ? "positiva" : "negativa"} (r ={" "}
                  {number(model.r, 3)})
                </strong>
                .
              </>
            ) : (
              <>No se puede estimar una asociación lineal con estos filtros.</>
            )}
          </p>
          <p>
            {chi.calculable
              ? chi.valid
                ? chi.p < 0.05
                  ? "La prueba chi-cuadrado encuentra evidencia de asociación entre verificar respuestas y rendimiento alto al 5 %."
                  : "La prueba chi-cuadrado no encuentra evidencia suficiente de asociación al 5 %."
                : "La tabla cruzada tiene frecuencias esperadas bajas: no es prudente interpretar su valor p."
              : "La selección no permite calcular la prueba de independencia."}{" "}
            Ninguna de estas conclusiones establece un efecto de la IA.
          </p>
        </div>
        <Explain>
          Estos resultados pertenecen a datos generados para practicar. Para
          estudiar una población real harían falta muestreo definido, mediciones
          validadas, consentimiento y control de factores como horas de estudio,
          semestre y carga académica. Una regresión múltiple podría explorar
          confusores; un diseño causal exigiría supuestos y procedimientos
          adicionales.
        </Explain>
      </Panel>
    </Section>
  );
}
