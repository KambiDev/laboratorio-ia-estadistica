import React from "react";
import { Section, Panel, Explain, Table } from "../components/ui.jsx";
import { number } from "../domain/statistics.js";

export default function Frequencies({ distribution, dominant }) {
  return (
    <Section
      id="frecuencias"
      index="03"
      title="Contar y agrupar"
      subtitle="Frecuencias absolutas, relativas, porcentuales y acumuladas cuando hay un orden numérico."
    >
      <div className="two-col">
        <Panel title="Uso principal de IA" kicker="VARIABLE NOMINAL">
          <Table
            headers={["USO", "f", "fr", "%"]}
            rows={
              distribution.total
                ? [
                    ...distribution.cat.map((c) => [
                      c.label,
                      c.count,
                      number(c.count / distribution.total, 3),
                      `${number((100 * c.count) / distribution.total, 1)} %`,
                    ]),
                    ["Total", distribution.total, number(1, 3), "100,0 %"],
                  ]
                : []
            }
          />
          <Explain>
            La frecuencia absoluta cuenta estudiantes. La relativa divide ese
            conteo por {distribution.total} observaciones válidas.{" "}
            {distribution.total
              ? `La categoría más frecuente es ${dominant}.`
              : "No hay datos visibles."}{" "}
            No se calcula frecuencia acumulada: los tipos de uso no tienen un
            orden natural.
          </Explain>
        </Panel>
        <Panel
          title="Horas de IA por semana"
          kicker="VARIABLE CUANTITATIVA / CLASES DE 2 H"
        >
          <Table
            headers={[
              "INTERVALO",
              "MARCA",
              "f",
              "fr",
              "%",
              "F ACUM.",
              "% ACUM.",
            ]}
            rows={
              distribution.n
                ? distribution.bins.map((b) => [
                    b.label,
                    b.mark,
                    b.count,
                    number(b.count / distribution.n, 3),
                    `${number((100 * b.count) / distribution.n, 1)} %`,
                    b.cumulative,
                    `${number((100 * b.cumulative) / distribution.n, 1)} %`,
                  ])
                : []
            }
          />
          <Explain>
            Las horas se agrupan en intervalos de dos; la marca es su punto
            medio.{" "}
            {distribution.n
              ? `${number((100 * (distribution.bins[0].count + distribution.bins[1].count)) / distribution.n, 1)} % utiliza IA menos de 4 horas por semana.`
              : "No hay horas válidas visibles."}{" "}
            La frecuencia acumulada suma casos hasta el extremo de cada clase;
            agrupar simplifica, pero pierde detalle.
          </Explain>
        </Panel>
      </div>
    </Section>
  );
}
