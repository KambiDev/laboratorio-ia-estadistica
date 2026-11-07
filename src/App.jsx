import React from "react";
import { number } from "./domain/statistics.js";
import { useLaboratory } from "./application/useLaboratory.js";
import Questionnaire from "./features/Questionnaire.jsx";
import Dataset from "./features/Dataset.jsx";
import Frequencies from "./features/Frequencies.jsx";
import Descriptive from "./features/Descriptive.jsx";
import Tests from "./features/Tests.jsx";
import Graphics from "./features/Graphics.jsx";
import Conclusions from "./features/Conclusions.jsx";

const NAV = [
  ["inicio", "Inicio"],
  ["cuestionario", "Cuestionario"],
  ["base", "Base de datos"],
  ["frecuencias", "Frecuencias"],
  ["descriptiva", "Descriptiva"],
  ["pruebas", "Pruebas"],
  ["graficos", "Gráficos"],
  ["interpretaciones", "Conclusiones"],
];

export default function App() {
  const lab = useLaboratory();
  const { records, visible, analysis } = lab;
  const { gradeStats, dominant } = analysis;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="identity" href="#inicio" aria-label="Volver al inicio">
          <span className="identity-icon">∑</span>
          <span>
            LAB/
            <br />
            ESTADÍSTICA
          </span>
        </a>
        <div className="sidebar-caption">INVESTIGACIÓN APLICADA / 01</div>
        <nav aria-label="Secciones del laboratorio">
          {NAV.map(([id, label], i) => (
            <a key={id} href={`#${id}`}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="live-dot" />
          72 registros simulados por muestra
          <br />
          Ningún estudiante real.
        </div>
      </aside>
      <main>
        <header className="hero" id="inicio">
          <div className="hero-top">
            <span>ESTUDIO DE CASO — EDUCACIÓN SUPERIOR</span>
            <span>LABORATORIO / 2026</span>
          </div>
          <div className="hero-body">
            <div>
              <p className="hero-eyebrow">Datos, métodos y lectura crítica.</p>
              <h1>
                IA Y<br />
                RENDIMIENTO
                <br />
                <span>ACADÉMICO.</span>
              </h1>
              <p className="hero-description">
                ¿Cómo se relacionan las horas de uso académico de IA y la
                verificación de sus respuestas con el promedio final? Manipula
                la muestra y observa qué cambia.
              </p>
              <a className="hero-link" href="#base">
                EXPLORAR LOS DATOS <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="hero-stamp" aria-hidden="true">
              <span>
                DATOS
                <br />
                SINTÉTICOS
              </span>
              <b>≠</b>
              <small>CAUSALIDAD</small>
            </div>
          </div>
          <div className="hero-bottom">
            <span>DATOS SINTÉTICOS CON FINES EDUCATIVOS</span>
            <span>ESTUDIO OBSERVACIONAL SIMULADO</span>
          </div>
        </header>

        <div className="dashboard-strip">
          <div>
            <span className="strip-label">REGISTROS VISIBLES</span>
            <strong>
              {number(visible.length, 0)}
              <small> / {number(records.length, 0)}</small>
            </strong>
            <span>Filtro activo sobre la muestra</span>
          </div>
          <div>
            <span className="strip-label">PROMEDIO ACADÉMICO</span>
            <strong>
              {gradeStats ? number(gradeStats.mean, 1) : "—"}
              <small> / 100</small>
            </strong>
            <span>Puntos de los registros visibles</span>
          </div>
          <div>
            <span className="strip-label">USO MÁS COMÚN</span>
            <strong className="strip-word">{dominant}</strong>
            <span>Uso principal de la IA</span>
          </div>
        </div>

        <div className="content">
          <div className="intro-note">
            <span className="square-icon">!</span>
            <p>
              <strong>Antes de empezar.</strong> Estos datos son simulados. Las
              asociaciones muestran cómo funcionan las técnicas, no describen
              estudiantes reales ni prueban que la IA cause cambios en el
              rendimiento.
            </p>
          </div>

          <Questionnaire />
          <Dataset
            query={lab.query}
            setQuery={lab.setQuery}
            useFilter={lab.useFilter}
            setUseFilter={lab.setUseFilter}
            verifyFilter={lab.verifyFilter}
            setVerifyFilter={lab.setVerifyFilter}
            clearFilters={lab.clearFilters}
            regenerate={lab.regenerate}
            visible={visible}
            recordsCount={records.length}
            sort={lab.sort}
            changeSort={lab.changeSort}
          />
          <Frequencies
            distribution={analysis.distribution}
            dominant={dominant}
          />
          <Descriptive hours={analysis.hours} grades={analysis.grades} />
          <Tests
            chi={analysis.chi}
            pairs={analysis.pairs}
            model={analysis.model}
            strength={analysis.strength}
          />
          <Graphics
            distribution={analysis.distribution}
            dominant={dominant}
            pairs={analysis.pairs}
            model={analysis.model}
            groupMeans={analysis.groupMeans}
          />
          <Conclusions
            visibleCount={visible.length}
            gradeStats={gradeStats}
            model={analysis.model}
            chi={analysis.chi}
          />
        </div>
        <footer className="footer">
          <span>LAB / ESTADÍSTICA APLICADA</span>
          <span>DATOS SINTÉTICOS CON FINES EDUCATIVOS · 2026</span>
        </footer>
      </main>
    </div>
  );
}
