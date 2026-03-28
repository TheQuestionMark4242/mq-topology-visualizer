import { useState, useCallback } from "react";
import type { Topology, FlowRow } from "@/types/mq-topology";
import { sampleRows } from "@/data/sampleTopologyData";

let nextId = 1;
function genId() {
  return `topo-${nextId++}`;
}

const initialTopology: Topology = {
  id: genId(),
  name: "Sample Topology",
  rows: sampleRows,
};

export function useTopologyStore() {
  const [topologies, setTopologies] = useState<Topology[]>([initialTopology]);
  const [activeTopologyId, setActiveTopologyId] = useState(initialTopology.id);

  const activeTopology = topologies.find((t) => t.id === activeTopologyId) ?? topologies[0];

  const addTopology = useCallback((name?: string, rows?: FlowRow[]) => {
    const newTopo: Topology = { id: genId(), name: name ?? "New Topology", rows: rows ?? [] };
    setTopologies((prev) => [...prev, newTopo]);
    setActiveTopologyId(newTopo.id);
  }, []);

  const cloneTopology = useCallback(() => {
    const source = topologies.find((t) => t.id === activeTopologyId);
    if (!source) return;
    const clone: Topology = {
      id: genId(),
      name: `Copy of ${source.name}`,
      rows: [...source.rows],
    };
    setTopologies((prev) => [...prev, clone]);
    setActiveTopologyId(clone.id);
  }, [topologies, activeTopologyId]);

  const renameTopology = useCallback((id: string, name: string) => {
    setTopologies((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  }, []);

  const removeTopology = useCallback(
    (id: string) => {
      setTopologies((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (next.length === 0) {
          const fallback: Topology = { id: genId(), name: "New Topology", rows: [] };
          setActiveTopologyId(fallback.id);
          return [fallback];
        }
        if (activeTopologyId === id) {
          setActiveTopologyId(next[0].id);
        }
        return next;
      });
    },
    [activeTopologyId]
  );

  return {
    topologies,
    activeTopologyId,
    activeTopology,
    setActiveTopologyId,
    addTopology,
    cloneTopology,
    renameTopology,
    removeTopology,
  };
}
