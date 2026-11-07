import { USES } from "./schema.js";

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const one = (x) => Math.round(x * 10) / 10;
function random(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
function gaussian(rand) {
  return (
    Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-12))) *
    Math.cos(2 * Math.PI * rand())
  );
}

export function generateSample(seed = 20261107) {
  const rand = random(seed);
  return Array.from({ length: 72 }, (_, i) => {
    const semester = 1 + Math.floor(rand() * 8);
    const mode = ["Presencial", "Híbrida", "Virtual"][Math.floor(rand() * 3)];
    const hoursAI = one(
      clamp(3.7 + gaussian(rand) * 2.35 + (semester - 4) * 0.1, 0, 10),
    );
    const frequency =
      hoursAI < 1.4 ? "Mensual" : hoursAI < 5 ? "Semanal" : "Diaria";
    const use = USES[Math.floor(rand() * 4)];
    const training = rand() < 0.45 ? "Sí" : "No";
    const verify =
      rand() < 0.36 + (training === "Sí" ? 0.2 : 0) + (semester >= 5 ? 0.1 : 0)
        ? "Sí"
        : "No";
    const hoursStudy = one(
      clamp(13 + gaussian(rand) * 4.8 + (semester - 4) * 0.24, 2, 28),
    );
    const sleep = one(clamp(7 + gaussian(rand) * 0.9, 4.5, 9));
    const courses = 2 + Math.floor(rand() * 6);
    const grade = one(
      clamp(
        56 +
          hoursStudy * 0.85 +
          hoursAI * 1.55 +
          (verify === "Sí" ? 4.5 : 0) +
          (sleep - 7) * 1.2 -
          (courses - 4) * 0.55 +
          gaussian(rand) * 7,
        35,
        99,
      ),
    );
    const perception =
      hoursAI < 1.5
        ? rand() < 0.65
          ? "Baja"
          : "Media"
        : hoursAI > 5
          ? rand() < 0.67
            ? "Alta"
            : "Media"
          : rand() < 0.25
            ? "Baja"
            : rand() < 0.65
              ? "Media"
              : "Alta";
    return {
      id: `E${String(i + 1).padStart(3, "0")}`,
      semester,
      mode,
      frequency,
      hoursAI,
      use,
      verify,
      training,
      hoursStudy,
      sleep,
      perception,
      grade,
      courses,
    };
  });
}
