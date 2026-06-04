import { useState, useMemo } from "react";
export function useFilter(items, key) {
  const [filter, setFilter] = useState("All");
  const filtered = useMemo(() =>
    filter === "All" ? items : items.filter(i => i[key].includes(filter)),
    [items, filter, key]
  );
  return { filtered, filter, setFilter };
}

// filter by multiple tags supported
