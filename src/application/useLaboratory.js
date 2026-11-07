import { useMemo, useState } from "react";
import { generateSample } from "../domain/sample.js";
import { analyze, selectVisible } from "../domain/analysis.js";

export function useLaboratory() {
  const [records, setRecords] = useState(() => generateSample());
  const [query, setQuery] = useState("");
  const [useFilter, setUseFilter] = useState("");
  const [verifyFilter, setVerifyFilter] = useState("");
  const [sort, setSort] = useState({ key: "id", direction: 1 });

  const visible = useMemo(
    () => selectVisible(records, { query, useFilter, verifyFilter, sort }),
    [records, query, useFilter, verifyFilter, sort],
  );
  const analysis = useMemo(() => analyze(visible), [visible]);

  function regenerate() {
    const seed = globalThis.crypto?.getRandomValues
      ? crypto.getRandomValues(new Uint32Array(1))[0]
      : Math.floor(Math.random() * 2 ** 32);
    setRecords(generateSample(seed));
  }
  function clearFilters() {
    setQuery("");
    setUseFilter("");
    setVerifyFilter("");
  }
  function changeSort(key) {
    setSort((current) => ({
      key,
      direction: current.key === key ? -current.direction : 1,
    }));
  }

  return {
    records,
    visible,
    analysis,
    query,
    setQuery,
    useFilter,
    setUseFilter,
    verifyFilter,
    setVerifyFilter,
    sort,
    regenerate,
    clearFilters,
    changeSort,
  };
}
