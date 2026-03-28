export type FlowRow = {
  app_name: string;
  queue_manager: string;
  queue_name: string;
  type: "producer" | "consumer";
};

export type Topology = {
  id: string;
  name: string;
  rows: FlowRow[];
};

export type NetworkGraph = {
  nodes: { id: string; label: string }[];
  edges: { id: string; source: string; target: string; label: string }[];
};

export type FlowHyperedge = {
  id: string;
  queue: string;
  queueManager: string;
  producers: string[];
  consumers: string[];
};

export type DataFlowGraph = {
  nodes: { id: string; label: string }[];
  hyperedges: FlowHyperedge[];
};

export type ArchitectureGraph = {
  appNodes: { id: string; label: string }[];
  qmNodes: { id: string; label: string }[];
  queueNodes: { id: string; label: string; queueManager: string }[];
  appToQMEdges: { app: string; qm: string }[];
  queueToQMEdges: { queue: string; qm: string }[];
  channelEdges: { source: string; target: string; label: string }[];
};

export type ViewType = "network" | "dataflow" | "architecture";
