import { useState, useImperativeHandle, forwardRef } from "react";
import type { ViewType, NetworkGraph, DataFlowGraph, ArchitectureGraph } from "@/types/mq-topology";
import ViewSwitcher from "./ViewSwitcher";
import CanvasToolbar from "./CanvasToolbar";
import NetworkCanvas from "./canvas/NetworkCanvas";
import DataFlowCanvas from "./canvas/DataFlowCanvas";
import ArchitectureCanvas from "./canvas/ArchitectureCanvas";
import type * as go from "gojs";

interface GraphData {
  network: NetworkGraph;
  dataFlow: DataFlowGraph;
  architecture: ArchitectureGraph;
}

export interface TopologyCanvasHandle {
  setGraphData: (data: GraphData) => void;
  onGraphChange: (callback: (data: GraphData) => void) => void;
}

interface TopologyCanvasProps {
  graphData: GraphData;
  topologyId: string;
}

const TopologyCanvas = forwardRef<TopologyCanvasHandle, TopologyCanvasProps>(
  ({ graphData, topologyId }, ref) => {
    const [activeView, setActiveView] = useState<ViewType>("network");
    const [diagramRef, setDiagramRef] = useState<go.Diagram | null>(null);

    useImperativeHandle(ref, () => ({
      setGraphData: (_data: GraphData) => {},
      onGraphChange: (_callback: (data: GraphData) => void) => {},
    }), []);

    return (
      <div className="flex flex-col flex-1 min-h-0">
        <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        <CanvasToolbar diagram={diagramRef} activeView={activeView} />
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            {activeView === "network" && (
              <NetworkCanvas data={graphData.network} topologyId={topologyId} onDiagramReady={setDiagramRef} />
            )}
            {activeView === "dataflow" && (
              <DataFlowCanvas data={graphData.dataFlow} topologyId={topologyId} onDiagramReady={setDiagramRef} />
            )}
            {activeView === "architecture" && (
              <ArchitectureCanvas data={graphData.architecture} topologyId={topologyId} onDiagramReady={setDiagramRef} />
            )}
          </div>
        </div>
      </div>
    );
  }
);

TopologyCanvas.displayName = "TopologyCanvas";

export default TopologyCanvas;
