import React from "react";
import { number } from "../domain/statistics.js";

const COLORS = ["#fa583a", "#1b524e", "#f3cd43", "#7697a9"];

function Frame({ children, label }) {
  return (
    <svg
      viewBox="0 0 520 290"
      role="img"
      aria-label={label}
      className="chart"
      preserveAspectRatio="xMidYMid meet"
    >
      {children}
    </svg>
  );
}

export function BarChart({
  labels,
  values,
  ceiling,
  unit = "estudiantes",
  palette = COLORS,
}) {
  const left = 52,
    top = 25,
    height = 208,
    width = 448,
    max = Math.max(ceiling || 0, ...values, 1);
  return (
    <Frame
      label={`Gráfico de barras: ${labels.map((x, i) => `${x}, ${number(values[i], 0)} ${unit}`).join("; ")}`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line
            x1={left}
            x2={500}
            y1={top + height - (i * height) / 4}
            y2={top + height - (i * height) / 4}
            className="chart-grid"
          />
          <text
            x={left - 8}
            y={top + height - (i * height) / 4 + 4}
            textAnchor="end"
          >
            {number((max * i) / 4, max === 100 ? 0 : 1)}
          </text>
        </g>
      ))}
      {labels.map((label, i) => {
        const step = width / labels.length,
          bw = Math.min(74, step * 0.64),
          x = left + (i + 0.5) * step,
          barHeight = (values[i] / max) * height;
        return (
          <g key={label}>
            <rect
              x={x - bw / 2}
              y={top + height - barHeight}
              width={bw}
              height={barHeight}
              fill={palette[i % palette.length]}
              stroke="#171717"
              strokeWidth="2"
            />
            <text
              x={x}
              y={Math.max(top - 5, top + height - barHeight - 7)}
              textAnchor="middle"
              fontWeight="800"
            >
              {number(values[i], Number.isInteger(values[i]) ? 0 : 1)}
            </text>
            <text x={x} y="255" textAnchor="middle" className="chart-label">
              {label}
            </text>
          </g>
        );
      })}
      <text x="276" y="283" textAnchor="middle" className="chart-unit">
        {unit}
      </text>
    </Frame>
  );
}

export function Histogram({ bins, polygon = false }) {
  const max = Math.max(...bins.map((b) => b.count), 1) * 1.15,
    left = 52,
    top = 25,
    height = 205,
    step = 448 / 5;
  const points = bins.map((b, i) => [
    left + (i + 0.5) * step,
    top + height - (b.count / max) * height,
  ]);
  return (
    <Frame
      label={
        polygon
          ? "Polígono de frecuencias de horas de IA"
          : "Histograma de horas de IA"
      }
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line
            className="chart-grid"
            x1={left}
            x2="500"
            y1={top + height - (i * height) / 4}
            y2={top + height - (i * height) / 4}
          />
          <text x="44" y={top + height - (i * height) / 4 + 4} textAnchor="end">
            {number((max * i) / 4, 0)}
          </text>
        </g>
      ))}
      {!polygon &&
        bins.map((b, i) => (
          <rect
            key={i}
            x={left + i * step + 1}
            y={points[i][1]}
            width={step - 2}
            height={top + height - points[i][1]}
            fill={COLORS[i % 4]}
            stroke="#171717"
            strokeWidth="1.5"
          />
        ))}
      {polygon && (
        <>
          <polyline
            points={`${left},${top + height} ${points.map((p) => p.join(",")).join(" ")} 500,${top + height}`}
            fill="none"
            stroke={COLORS[0]}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {points.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="6"
              fill="#f3cd43"
              stroke="#171717"
              strokeWidth="2"
            />
          ))}
        </>
      )}
      {bins.map((b, i) => (
        <text
          key={i}
          className="chart-label"
          x={points[i][0]}
          y="252"
          textAnchor="middle"
        >
          {polygon ? b.mark : `${i * 2}–${i * 2 + 2}`}
        </text>
      ))}
      <text x="276" y="283" textAnchor="middle" className="chart-unit">
        {polygon
          ? "Marca de clase (horas/semana)"
          : "Intervalo de horas/semana"}
      </text>
    </Frame>
  );
}

export function PieChart({ categories, total }) {
  if (!total) return null;
  let start = -Math.PI / 2;
  const slices = categories.map((category, i) => {
    if (!category.count) return null;
    const end = start + (2 * Math.PI * category.count) / total;
    if (category.count === total) {
      start = end;
      return (
        <circle
          key={category.label}
          cx="148"
          cy="140"
          r="97"
          fill={COLORS[i]}
          stroke="#171717"
          strokeWidth="2"
        />
      );
    }
    const a = [148 + 97 * Math.cos(start), 140 + 97 * Math.sin(start)],
      b = [148 + 97 * Math.cos(end), 140 + 97 * Math.sin(end)];
    const path = `M 148 140 L ${a[0]} ${a[1]} A 97 97 0 ${end - start > Math.PI ? 1 : 0} 1 ${b[0]} ${b[1]} Z`;
    start = end;
    return (
      <path
        key={category.label}
        d={path}
        fill={COLORS[i]}
        stroke="#171717"
        strokeWidth="2"
      />
    );
  });
  return (
    <Frame label="Porcentaje de estudiantes por uso principal de IA">
      {slices}
      {categories.map((c, i) => (
        <g key={c.label}>
          <rect
            x="284"
            y={58 + i * 48}
            width="14"
            height="14"
            fill={COLORS[i]}
            stroke="#171717"
            strokeWidth="1.5"
          />
          <text x="308" y={70 + i * 48} className="chart-label">
            {c.label}: {number((c.count / total) * 100, 1)} %
          </text>
        </g>
      ))}
    </Frame>
  );
}

export function ScatterChart({ pairs, model }) {
  const left = 56,
    top = 22,
    height = 211,
    width = 443,
    maxX = Math.max(10, ...pairs.map((p) => p.x));
  const px = (x) => left + (x / maxX) * width,
    py = (y) => top + height - (y / 100) * height;
  return (
    <Frame label="Diagrama de dispersión de horas de IA y promedio académico con recta de regresión">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <line
            className="chart-grid"
            x1={left}
            x2="499"
            y1={py(i * 20)}
            y2={py(i * 20)}
          />
          <text x="48" y={py(i * 20) + 4} textAnchor="end">
            {i * 20}
          </text>
          <text x={px((maxX * i) / 5)} y="251" textAnchor="middle">
            {number((maxX * i) / 5, 0)}
          </text>
        </g>
      ))}
      {pairs.map((p, i) => (
        <circle
          key={`${p.id}-${i}`}
          cx={px(p.x)}
          cy={py(p.y)}
          r="4.5"
          fill="#1b524e"
          fillOpacity=".64"
          stroke="#171717"
          strokeWidth=".5"
        >
          <title>
            {p.id}: {number(p.x)} h; promedio {number(p.y)}
          </title>
        </circle>
      ))}
      {model && (
        <line
          x1={px(model.minX)}
          y1={py(model.estimate(model.minX))}
          x2={px(model.maxX)}
          y2={py(model.estimate(model.maxX))}
          stroke="#fa583a"
          strokeWidth="4"
        />
      )}
      <text x="276" y="281" textAnchor="middle" className="chart-unit">
        Horas IA/semana · promedio en puntos (eje vertical)
      </text>
    </Frame>
  );
}
