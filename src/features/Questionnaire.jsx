import React from "react";
import { Section, Panel, Explain, Table } from "../components/ui.jsx";
import { FIELDS } from "../domain/schema.js";

export default function Questionnaire({}) {
  return (
    <Section
      id="cuestionario"
      index="01"
      title="El instrumento"
      subtitle="12 preguntas medibles. Una variable por respuesta; un identificador técnico adicional."
    >
      <Panel
        title="Cuestionario y codificación"
        kicker="DISEÑO / ENCUESTA TRANSVERSAL"
      >
        <Table
          headers={["N.º / PREGUNTA", "VARIABLE", "TIPO", "CODIFICACIÓN"]}
          rows={FIELDS.slice(1).map((f, i) => [
            <span className="question" key={f.key}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              {f.question}
            </span>,
            f.key,
            f.type,
            f.coding,
          ])}
        />
        <Explain>
          Las categorías nominales se cuentan sin orden intrínseco; las
          ordinales sí tienen orden. Las horas y el promedio admiten operaciones
          numéricas. «Rendimiento alto» se define aquí, solo para la tabla
          cruzada, como promedio ≥ 80 puntos. Las horas de estudio no incluyen
          las horas dedicadas a IA.
        </Explain>
      </Panel>
    </Section>
  );
}
