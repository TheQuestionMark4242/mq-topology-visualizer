import { useState, useImperativeHandle, forwardRef, useCallback } from "react";
import type { ViewType, NetworkGraph, DataFlowGraph, ArchitectureGraph } from "@/types/mq-topology";
import ViewSwitcher from "./ViewSwitcher";
import NetworkCanvas from "./canvas/NetworkCanvas";
import DataFlowCanvas from "./canvas/DataFlowCanvas";
import ArchitectureCanvas from "./canvas/ArchitectureCanvas";

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
}

const TopologyCanvas = forwardRef<TopologyCanvasHandle, TopologyCanvasProps>(
  ({ graphData }, ref) => {
    const [activeView, setActiveView] = useState<ViewType>("network");

    // Stub imperative methods for future use
    useImperativeHandle(ref, () => ({
      setGraphData: (_data: GraphData) => {
        // Stub: will be used to push data imperatively
      },
      onGraphChange: (_callback: (data: GraphData) => void) => {
        // Stub: will be used to subscribe to graph edits
      },
    }), []);

    return (
      <div className="flex flex-col flex-1 min-h-0">
        <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 min-h-0">
          {activeView === "network" && <NetworkCanvas data={graphData.network} />}
          {activeView === "dataflow" && <DataFlowCanvas data={graphData.dataFlow} />}
          {activeView === "architecture" && <ArchitectureCanvas data={graphData.architecture} />}
        </div>
      </div>
    );
  }
);

TopologyCanvas.displayName = "TopologyCanvas";

export default TopologyCanvas;
