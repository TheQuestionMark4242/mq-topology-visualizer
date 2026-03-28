import { useEffect, useRef } from "react";
import * as go from "gojs";
import type { ArchitectureGraph } from "@/types/mq-topology";

interface ArchitectureCanvasProps {
  data: ArchitectureGraph;
}

export default function ArchitectureCanvas({ data }: ArchitectureCanvasProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        layerSpacing: 140,
        columnSpacing: 30,
        setsPortSpots: false,
      }),
      initialAutoScale: go.AutoScale.Uniform,
      padding: 60,
    });

    // QM group template
    diagram.groupTemplateMap.add(
      "qm",
      $(
        go.Group,
        "Auto",
        {
          layout: $(go.GridLayout, {
            wrappingColumn: 1,
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(6, 6),
          }),
          padding: new go.Margin(28, 12, 12, 12),
        },
        $(go.Shape, "RoundedRectangle", {
          parameter1: 6,
          fill: "hsl(211, 60%, 95%)",
          stroke: "hsl(211, 50%, 70%)",
          strokeWidth: 2,
        }),
        $(
          go.Panel,
          "Vertical",
          $(
            go.Panel,
            "Horizontal",
            { alignment: go.Spot.TopLeft, margin: new go.Margin(6, 8, 4, 8) },
            $(go.TextBlock, {
              font: "bold 13px 'JetBrains Mono', 'SF Mono', monospace",
              stroke: "hsl(211, 68%, 30%)",
            }, new go.Binding("text", "label"))
          ),
          $(go.Placeholder, { padding: new go.Margin(4, 8, 8, 8) })
        )
      )
    );

    // Queue node template (inside QM groups)
    diagram.nodeTemplateMap.add(
      "queue",
      $(
        go.Node,
        "Auto",
        $(go.Shape, "RoundedRectangle", {
          parameter1: 4,
          fill: "hsl(195, 55%, 92%)",
          stroke: "hsl(195, 50%, 55%)",
          strokeWidth: 1.5,
          minSize: new go.Size(120, 30),
        }),
        $(go.TextBlock, {
          font: "11px 'JetBrains Mono', 'SF Mono', monospace",
          stroke: "hsl(215, 30%, 20%)",
          margin: new go.Margin(6, 10, 6, 10),
        }, new go.Binding("text", "label"))
      )
    );

    // App node template (outside groups)
    diagram.nodeTemplateMap.add(
      "app",
      $(
        go.Node,
        "Auto",
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

    // Links
    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Routing.AvoidsNodes, corner: 10, curve: go.Curve.JumpOver },
      $(go.Shape, { stroke: "hsl(211, 68%, 40%)", strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Triangle", fill: "hsl(211, 68%, 40%)", stroke: null, scale: 1 })
    );

    // Channel link template
    diagram.linkTemplateMap.add(
      "channel",
      $(
        go.Link,
        { routing: go.Routing.AvoidsNodes, corner: 12, curve: go.Curve.JumpOver },
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
      )
    );

    diagramRef.current = diagram;

    return () => { diagram.div = null; };
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    const nodeArray: object[] = [];
    const linkArray: object[] = [];

    // QM groups
    data.qmNodes.forEach((qm) => {
      nodeArray.push({ key: qm.id, label: qm.label, isGroup: true, category: "qm" });
    });

    // Queue nodes inside groups
    data.queueNodes.forEach((q) => {
      nodeArray.push({ key: q.id, label: q.label, group: q.queueManager, category: "queue" });
    });

    // App nodes
    data.appNodes.forEach((app) => {
      nodeArray.push({ key: app.id, label: app.label, category: "app" });
    });

    // App-to-QM edges (dashed)
    data.appToQMEdges.forEach((e) => {
      linkArray.push({ from: e.app, to: e.qm });
    });

    // Channel edges
    data.channelEdges.forEach((ch) => {
      linkArray.push({ from: ch.source, to: ch.target, label: ch.label, category: "channel" });
    });

    diagram.model = new go.GraphLinksModel(nodeArray, linkArray);
    (diagram.model as go.GraphLinksModel).linkCategoryProperty = "category";
  }, [data]);

  return <div ref={divRef} className="flex-1 w-full" />;
}
