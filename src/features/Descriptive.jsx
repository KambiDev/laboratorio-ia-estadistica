import React from "react";
import { Section } from "../components/ui.jsx";
import StatPanel from "../components/StatPanel.jsx";
import { QUANTITATIVE_FIELDS } from "../domain/schema.js";
import { validNumbers } from "../domain/statistics.js";

export default function Descriptive({ visible }) {
  return (
    <Section
      id="descriptiva"
      index="04"
      title="Centro y dispersión"
      subtitle="Todas las variables cuantitativas. Varianza y desviación con n − 1; CV solo donde la escala tiene cero interpretable."
    >
      <div className="two-col">
        {QUANTITATIVE_FIELDS.map(({ key, title, unit, coefficient }) => (
          <StatPanel
            key={key}
            title={title}
            unit={unit}
            coefficient={coefficient}
            data={validNumbers(visible, key)}
          />
        ))}
      </div>
    </Section>
  );
}
