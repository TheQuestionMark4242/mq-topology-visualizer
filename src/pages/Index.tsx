import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useTopologyStore } from "@/hooks/useTopologyStore";
import TopologyTabStrip from "@/components/mq-governance/TopologyTabStrip";
import TopologyCanvas, { type TopologyCanvasHandle } from "@/components/mq-governance/TopologyCanvas";
import ChatSidebar from "@/components/mq-governance/ChatSidebar";
import MetricsSidebar from "@/components/mq-governance/MetricsSidebar";
import CsvUploadModal from "@/components/mq-governance/CsvUploadModal";
import { Button } from "@/components/ui/button";
import type { FlowRow } from "@/types/mq-topology";
import {
  sampleNetworkGraph,
  sampleDataFlowGraph,
  sampleArchitectureGraph,
} from "@/data/sampleTopologyData";

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
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);

  const graphData =
    store.activeTopology.rows.length > 0 ? sampleGraphData : emptyGraphData;

  const handleCsvConfirm = (name: string, rows: FlowRow[]) => {
    store.addTopology(name, rows);
    setCsvOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-3">
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          IBM MQ Governance
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Topology explorer — network, data flow, and architecture views
        </p>
      </header>

      {/* Tab strip with CSV upload */}
      <div className="flex items-end border-b border-border bg-muted/30">
        <TopologyTabStrip
          topologies={store.topologies}
          activeTopologyId={store.activeTopologyId}
          onSelect={store.setActiveTopologyId}
          onAdd={() => store.addTopology()}
          onClone={store.cloneTopology}
          onRename={store.renameTopology}
          onRemove={store.removeTopology}
        />
        <div className="ml-auto pr-4 pb-1">
          <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" onClick={() => setCsvOpen(true)}>
            <Upload className="w-3.5 h-3.5 mr-1" />
            Load CSV
          </Button>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — Chat */}
        <div
          className="flex border-r border-border bg-card transition-[width] duration-200 ease-in-out shrink-0"
          style={{ width: leftCollapsed ? 40 : 300 }}
        >
          {leftCollapsed ? (
            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => setLeftCollapsed(false)}
                className="p-2 mt-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span
                className="text-xs font-medium text-muted-foreground mt-4"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                Chat
              </span>
            </div>
          ) : (
            <div className="flex flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <ChatSidebar
                  topologyId={store.activeTopologyId}
                  topologyName={store.activeTopology.name}
                />
              </div>
              <div className="flex flex-col items-center justify-center border-l border-border">
                <button
                  onClick={() => setLeftCollapsed(true)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center — Canvas */}
        <div className="flex-1 min-w-0 flex flex-col">
          <TopologyCanvas
            key={store.activeTopologyId}
            ref={canvasRef}
            graphData={graphData}
            topologyId={store.activeTopologyId}
          />
        </div>

        {/* Right sidebar — Metrics */}
        <div
          className="flex border-l border-border bg-card transition-[width] duration-200 ease-in-out shrink-0"
          style={{ width: rightCollapsed ? 40 : 280 }}
        >
          {rightCollapsed ? (
            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => setRightCollapsed(false)}
                className="p-2 mt-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                className="text-xs font-medium text-muted-foreground mt-4"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                Metrics
              </span>
            </div>
          ) : (
            <div className="flex flex-1 min-w-0">
              <div className="flex flex-col items-center justify-center border-r border-border">
                <button
                  onClick={() => setRightCollapsed(true)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <MetricsSidebar />
              </div>
            </div>
          )}
        </div>
      </div>

      <CsvUploadModal
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        onConfirm={handleCsvConfirm}
      />
    </div>
  );
}
