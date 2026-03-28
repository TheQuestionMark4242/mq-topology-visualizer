import { useEffect, useRef } from "react";
import * as go from "gojs";
import type { ArchitectureGraph } from "@/types/mq-topology";

interface ArchitectureCanvasProps {
  data: ArchitectureGraph;
  topologyId: string;
  onDiagramReady: (diagram: go.Diagram) => void;
}

export default function ArchitectureCanvas({ data, topologyId, onDiagramReady }: ArchitectureCanvasProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true,
      "linkingTool.isEnabled": false,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0, layerSpacing: 140, columnSpacing: 30, setsPortSpots: false,
      }),
      initialAutoScale: go.AutoScale.Uniform,
      padding: 60,
    });

    diagram.groupTemplateMap.add(
      "qm",
      $(
        go.Group, "Auto",
        {
          layout: $(go.GridLayout, {
            wrappingColumn: 1, cellSize: new go.Size(1, 1), spacing: new go.Size(6, 6),
          }),
          padding: new go.Margin(28, 12, 12, 12),
        },
        $(go.Shape, "RoundedRectangle", {
          parameter1: 6, fill: "hsl(211, 60%, 95%)", stroke: "hsl(211, 50%, 70%)", strokeWidth: 2,
        }),
        $(
          go.Panel, "Vertical",
          $(
            go.Panel, "Horizontal",
            { alignment: go.Spot.TopLeft, margin: new go.Margin(6, 8, 4, 8) },
            $(go.TextBlock, {
              font: "bold 13px 'JetBrains Mono', 'SF Mono', monospace",
              stroke: "hsl(211, 68%, 30%)",
              editable: true,
            }, new go.Binding("text", "label").makeTwoWay())
          ),
          $(go.Placeholder, { padding: new go.Margin(4, 8, 8, 8) })
        )
      )
    );

    diagram.nodeTemplateMap.add(
      "queue",
      $(
        go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", {
          parameter1: 4, fill: "hsl(195, 55%, 92%)", stroke: "hsl(195, 50%, 55%)",
          strokeWidth: 1.5, minSize: new go.Size(120, 30),
        }),
        $(go.TextBlock, {
          font: "11px 'JetBrains Mono', 'SF Mono', monospace",
          stroke: "hsl(215, 30%, 20%)",
          margin: new go.Margin(6, 10, 6, 10),
          editable: true,
        }, new go.Binding("text", "label").makeTwoWay())
      )
    );

    diagram.nodeTemplateMap.add(
      "app",
      $(
        go.Node, "Auto",
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

    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Routing.AvoidsNodes, corner: 10, curve: go.Curve.JumpOver },
      $(go.Shape, { stroke: "hsl(211, 68%, 40%)", strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Triangle", fill: "hsl(211, 68%, 40%)", stroke: null, scale: 1 })
    );

    diagram.linkTemplateMap.add(
      "channel",
      $(
        go.Link,
        { routing: go.Routing.Normal, corner: 12, curve: go.Curve.Bezier },
        new go.Binding("curviness", "curviness"),
        $(go.Shape, { stroke: "hsl(211, 68%, 40%)", strokeWidth: 2.5 }),
        $(go.Shape, { toArrow: "Triangle", fill: "hsl(211, 68%, 40%)", stroke: null, scale: 1.2 }),
        $(
          go.Panel, "Auto",
          $(go.Shape, "RoundedRectangle", {
            parameter1: 3, fill: "hsl(0, 0%, 100%)", stroke: "hsl(211, 50%, 70%)", strokeWidth: 1,
          }),
          $(go.TextBlock, {
            font: "10px 'JetBrains Mono', 'SF Mono', monospace",
            stroke: "hsl(211, 68%, 30%)",
            margin: new go.Margin(3, 6, 3, 6),
            editable: true,
          }, new go.Binding("text", "label").makeTwoWay())
        )
      )
    );

    diagramRef.current = diagram;
    onDiagramReady(diagram);

    return () => { diagram.div = null; };
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    const nodeArray: object[] = [];
    const linkArray: object[] = [];

    data.qmNodes.forEach((qm) => {
      nodeArray.push({ key: qm.id, label: qm.label, isGroup: true, category: "qm" });
    });
    data.queueNodes.forEach((q) => {
      nodeArray.push({ key: q.id, label: q.label, group: q.queueManager, category: "queue" });
    });
    data.appNodes.forEach((app) => {
      nodeArray.push({ key: app.id, label: app.label, category: "app" });
    });
    data.appToQMEdges.forEach((e) => {
      linkArray.push({ from: e.app, to: e.qm });
    });
    const chSeen = new Set<string>();
    data.channelEdges.forEach((ch) => {
      const pairKey = [ch.source, ch.target].sort().join("|");
      const curv = chSeen.has(pairKey) ? -30 : 30;
      chSeen.add(pairKey);
      linkArray.push({ from: ch.source, to: ch.target, label: ch.label, category: "channel", curviness: curv });
    });

    const model = new go.GraphLinksModel(nodeArray, linkArray);
    model.linkCategoryProperty = "category";
    diagram.model = model;
  }, [data, topologyId]);

  return <div ref={divRef} className="w-full h-full" />;
}
