import { useEffect, useRef } from "react";
import * as go from "gojs";
import type { DataFlowGraph } from "@/types/mq-topology";

interface DataFlowCanvasProps {
  data: DataFlowGraph;
}

export default function DataFlowCanvas({ data }: DataFlowCanvasProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        layerSpacing: 100,
        columnSpacing: 30,
        setsPortSpots: false,
      }),
      initialAutoScale: go.AutoScale.Uniform,
      padding: 60,
    });

    // App node template
    diagram.nodeTemplateMap.add(
      "app",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "RoundedRectangle", {
          parameter1: 6,
          fill: "hsl(160, 50%, 92%)",
          stroke: "hsl(160, 45%, 50%)",
          strokeWidth: 2,
          minSize: new go.Size(130, 38),
        }),
        $(go.TextBlock, {
          font: "bold 12px 'JetBrains Mono', 'SF Mono', monospace",
          stroke: "hsl(160, 40%, 20%)",
          margin: new go.Margin(8, 14, 8, 14),
        }, new go.Binding("text", "label"))
      )
    );

    // Queue intermediate node template
    diagram.nodeTemplateMap.add(
      "queue",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "Diamond", {
          fill: "hsl(40, 80%, 92%)",
          stroke: "hsl(40, 60%, 55%)",
          strokeWidth: 2,
          width: 28,
          height: 28,
        }),
        $(go.TextBlock, {
          font: "10px 'JetBrains Mono', 'SF Mono', monospace",
          stroke: "hsl(40, 50%, 25%)",
          margin: new go.Margin(0, 6, 0, 6),
          alignment: go.Spot.Bottom,
          alignmentFocus: go.Spot.Top,
        }, new go.Binding("text", "label"))
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Routing.Normal, corner: 8 },
      $(go.Shape, { stroke: "hsl(211, 68%, 40%)", strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Triangle", fill: "hsl(211, 68%, 40%)", stroke: null, scale: 1 })
    );

    diagramRef.current = diagram;

    return () => { diagram.div = null; };
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    const nodeArray: object[] = data.nodes.map((n) => ({
      key: n.id,
      label: n.label,
      category: "app",
    }));

    const linkArray: object[] = [];

    // Add queue intermediate nodes and edges
    data.hyperedges.forEach((he) => {
      const queueKey = `${he.queue}@${he.queueManager}`;
      nodeArray.push({
        key: queueKey,
        label: queueKey,
        category: "queue",
      });

      he.producers.forEach((p) => {
        linkArray.push({ from: p, to: queueKey });
      });
      he.consumers.forEach((c) => {
        linkArray.push({ from: queueKey, to: c });
      });
    });

    diagram.model = new go.GraphLinksModel(nodeArray, linkArray);
  }, [data]);

  return <div ref={divRef} className="flex-1 w-full" />;
}
