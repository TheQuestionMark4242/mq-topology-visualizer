import { useEffect, useRef } from "react";
import * as go from "gojs";
import type { DataFlowGraph } from "@/types/mq-topology";

interface DataFlowCanvasProps {
  data: DataFlowGraph;
  topologyId: string;
  onDiagramReady: (diagram: go.Diagram) => void;
}

export default function DataFlowCanvas({ data, topologyId, onDiagramReady }: DataFlowCanvasProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true,
      "linkingTool.isEnabled": false,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        layerSpacing: 100,
        columnSpacing: 30,
        setsPortSpots: false,
      }),
      initialAutoScale: go.AutoScale.Uniform,
      padding: 60,
    });

    diagram.nodeTemplateMap.add(
      "app",
      $(
        go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "RoundedRectangle", {
          parameter1: 6, fill: "hsl(160, 50%, 92%)", stroke: "hsl(160, 45%, 50%)",
          strokeWidth: 2, minSize: new go.Size(130, 38),
        }),
        $(go.TextBlock, {
          font: "bold 12px 'JetBrains Mono', 'SF Mono', monospace",
          stroke: "hsl(160, 40%, 20%)",
          margin: new go.Margin(8, 14, 8, 14),
          editable: true,
        }, new go.Binding("text", "label").makeTwoWay())
      )
    );

    diagram.nodeTemplateMap.add(
      "queue",
      $(
        go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "RoundedRectangle", {
          parameter1: 4, fill: "hsl(40, 80%, 92%)", stroke: "hsl(40, 60%, 55%)",
          strokeWidth: 2, minSize: new go.Size(120, 32),
        }),
        $(go.TextBlock, {
          font: "11px 'JetBrains Mono', 'SF Mono', monospace",
          stroke: "hsl(40, 50%, 25%)",
          margin: new go.Margin(6, 10, 6, 10),
          editable: true,
        }, new go.Binding("text", "label").makeTwoWay())
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Routing.Normal, corner: 8 },
      $(go.Shape, { stroke: "hsl(211, 68%, 40%)", strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Triangle", fill: "hsl(211, 68%, 40%)", stroke: null, scale: 1 })
    );

    diagramRef.current = diagram;
    onDiagramReady(diagram);

    return () => { diagram.div = null; };
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    const nodeArray: object[] = data.nodes.map((n) => ({
      key: n.id, label: n.label, category: "app",
    }));
    const linkArray: object[] = [];

    data.hyperedges.forEach((he) => {
      const queueKey = `${he.queue}@${he.queueManager}`;
      nodeArray.push({ key: queueKey, label: queueKey, category: "queue" });
      he.producers.forEach((p) => linkArray.push({ from: p, to: queueKey }));
      he.consumers.forEach((c) => linkArray.push({ from: queueKey, to: c }));
    });

    diagram.model = new go.GraphLinksModel(nodeArray, linkArray);
  }, [data, topologyId]);

  return <div ref={divRef} className="w-full h-full" />;
}
