import React from "react";
import { Section, Panel, Explain, Table } from "../components/ui.jsx";
import StatPanel from "../components/StatPanel.jsx";

export default function Descriptive({ hours, grades }) {
  return (
    <Section
      id="descriptiva"
      index="04"
      title="Centro y dispersión"
      subtitle="La varianza y la desviación estándar usan el denominador muestral n − 1."
    >
      <div className="two-col">
        <StatPanel
          title="Horas de uso de IA"
          unit="HORAS / SEMANA"
          data={hours}
        />
        <StatPanel
          title="Promedio académico"
          unit="PUNTOS / 100"
          data={grades}
        />
      </div>
    </Section>
  );
}
