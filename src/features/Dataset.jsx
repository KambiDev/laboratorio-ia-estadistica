import React from "react";
import { Section, Panel, Explain, Table } from "../components/ui.jsx";
import { FIELDS, USES } from "../domain/schema.js";
import { exportCSV } from "../services/exportCSV.js";

export default function Dataset({
  query,
  setQuery,
  useFilter,
  setUseFilter,
  verifyFilter,
  setVerifyFilter,
  clearFilters,
  regenerate,
  visible,
  recordsCount,
  sort,
  changeSort,
}) {
  return (
    <Section
      id="base"
      index="02"
      title="La muestra"
      subtitle="72 estudiantes simulados al inicio. Buscar y filtrar cambia TODOS los resultados; ordenar no cambia los cálculos."
    >
      <Panel
        title="Base de datos interactiva"
        kicker="DATOS SINTÉTICOS / FINES EDUCATIVOS"
      >
        <div className="controls no-print">
          <label>
            BUSCAR EN COLUMNAS
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ID, categoría, cifra…"
            />
          </label>
          <label>
            USO PRINCIPAL
            <select
              value={useFilter}
              onChange={(e) => setUseFilter(e.target.value)}
            >
              <option value="">Todos los usos</option>
              {USES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
          <label>
            VERIFICACIÓN
            <select
              value={verifyFilter}
              onChange={(e) => setVerifyFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </label>
        </div>
        <div className="actions no-print">
          <button onClick={clearFilters} className="button ghost">
            LIMPIAR FILTROS
          </button>
          <button onClick={regenerate} className="button accent">
            ↻ NUEVA MUESTRA
          </button>
          <button onClick={() => exportCSV(visible)} className="button">
            ↓ CSV VISIBLE
          </button>
          <button onClick={() => window.print()} className="button ghost">
            ⎙ IMPRIMIR
          </button>
        </div>
        <div className="data-meta" aria-live="polite">
          <strong>
            {visible.length} / {recordsCount}
          </strong>{" "}
          registros visibles · Pulsa una cabecera para ordenar.
        </div>
        <div className="table-scroll data-table">
          <table>
            <thead>
              <tr>
                {FIELDS.map((f) => (
                  <th key={f.key}>
                    <button
                      className="sort-button"
                      onClick={() => changeSort(f.key)}
                      aria-label={`Ordenar por ${f.label}`}
                      aria-sort={
                        sort.key === f.key
                          ? sort.direction === 1
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      {f.label}{" "}
                      {sort.key === f.key
                        ? sort.direction === 1
                          ? "↑"
                          : "↓"
                        : ""}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((r) => (
                  <tr key={r.id}>
                    {FIELDS.map((f) => (
                      <td key={f.key}>{r[f.key]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={FIELDS.length} className="empty-cell">
                    No hay coincidencias. Limpia los filtros para recuperar la
                    muestra.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Explain>
          Cada fila representa un estudiante ficticio. El CSV descarga
          exactamente las filas visibles. Filtrar altera la composición y el
          tamaño de la muestra, por lo que también pueden variar las
          asociaciones y la validez de una prueba estadística.
        </Explain>
      </Panel>
    </Section>
  );
}
