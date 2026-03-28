import { useRef } from "react";
import { useTopologyStore } from "@/hooks/useTopologyStore";
import TopologyTabStrip from "@/components/mq-governance/TopologyTabStrip";
import TopologyCanvas, { type TopologyCanvasHandle } from "@/components/mq-governance/TopologyCanvas";
import {
  sampleNetworkGraph,
  sampleDataFlowGraph,
  sampleArchitectureGraph,
} from "@/data/sampleTopologyData";

// For now, all topologies use the same sample graph data.
// In the future, each topology's rows will be derived into its own graph data.
const sampleGraphData = {
  network: sampleNetworkGraph,
  dataFlow: sampleDataFlowGraph,
  architecture: sampleArchitectureGraph,
};

const emptyGraphData = {
  network: { nodes: [], edges: [] },
  dataFlow: { nodes: [], hyperedges: [] },
  architecture: {
    appNodes: [],
    qmNodes: [],
    queueNodes: [],
    appToQMEdges: [],
    queueToQMEdges: [],
    channelEdges: [],
  },
};

export default function Index() {
  const store = useTopologyStore();
  const canvasRef = useRef<TopologyCanvasHandle>(null);

  const graphData =
    store.activeTopology.rows.length > 0 ? sampleGraphData : emptyGraphData;

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          IBM MQ Governance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Topology explorer — network, data flow, and architecture views
        </p>
      </header>

      <TopologyTabStrip
        topologies={store.topologies}
        activeTopologyId={store.activeTopologyId}
        onSelect={store.setActiveTopologyId}
        onAdd={store.addTopology}
        onClone={store.cloneTopology}
        onRename={store.renameTopology}
        onRemove={store.removeTopology}
      />

      <TopologyCanvas ref={canvasRef} graphData={graphData} />
    </div>
  );
}
