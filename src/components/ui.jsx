import React from "react";

export function Section({ id, index, title, subtitle, children }) {
  return (
    <section className="section" id={id}>
      <header className="section-heading">
        <span className="section-index">{index} / 07</span>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}
export function Panel({ title, kicker, children, className = "" }) {
  return (
    <article className={`panel ${className}`}>
      <div className="panel-heading">
        <span>{kicker}</span>
        <h3>{title}</h3>
      </div>
      {children}
    </article>
  );
}
export function Explain({ children }) {
  return (
    <div className="explain">
      <strong>¿Cómo se interpreta?</strong>
      <p>{children}</p>
    </div>
  );
}
export function Table({
  headers,
  rows,
  empty = "No hay registros para mostrar.",
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="empty-cell">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
