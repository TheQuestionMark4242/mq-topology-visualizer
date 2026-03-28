import { useEffect, useRef } from "react";
import * as go from "gojs";
import type { NetworkGraph } from "@/types/mq-topology";

interface NetworkCanvasProps {
  data: NetworkGraph;
}

export default function NetworkCanvas({ data }: NetworkCanvasProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true,
      layout: $(go.ForceDirectedLayout, {
        maxIterations: 200,
        defaultSpringLength: 120,
        defaultElectricalCharge: 200,
      }),
      initialAutoScale: go.AutoScale.Uniform,
      padding: 60,
    });

    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      { locationSpot: go.Spot.Center },
      $(go.Shape, "RoundedRectangle", {
        parameter1: 6,
        fill: "hsl(211, 60%, 95%)",
        stroke: "hsl(211, 50%, 70%)",
        strokeWidth: 2,
        minSize: new go.Size(100, 44),
      }),
      $(go.TextBlock, {
        font: "bold 13px 'JetBrains Mono', 'SF Mono', monospace",
        stroke: "hsl(211, 68%, 30%)",
        margin: new go.Margin(10, 16, 10, 16),
      }, new go.Binding("text", "label"))
    );

    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Routing.AvoidsNodes,
        corner: 10,
        curve: go.Curve.JumpOver,
      },
      $(go.Shape, { stroke: "hsl(211, 68%, 40%)", strokeWidth: 2.5 }),
      $(go.Shape, { toArrow: "Triangle", fill: "hsl(211, 68%, 40%)", stroke: null, scale: 1.2 }),
      $(
        go.Panel,
        "Auto",
        $(go.Shape, "RoundedRectangle", {
          parameter1: 3,
          fill: "hsl(0, 0%, 100%)",
          stroke: "hsl(211, 50%, 70%)",
          strokeWidth: 1,
        }),
        $(go.TextBlock, {
          font: "10px 'JetBrains Mono', 'SF Mono', monospace",
          stroke: "hsl(211, 68%, 30%)",
          margin: new go.Margin(3, 6, 3, 6),
        }, new go.Binding("text", "label"))
      )
    );

    diagramRef.current = diagram;

    return () => { diagram.div = null; };
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    const nodeArray = data.nodes.map((n) => ({ key: n.id, label: n.label }));
    const linkArray = data.edges.map((e) => ({ from: e.source, to: e.target, label: e.label }));

    diagram.model = new go.GraphLinksModel(nodeArray, linkArray);
  }, [data]);

  return <div ref={divRef} className="flex-1 w-full" />;
}
