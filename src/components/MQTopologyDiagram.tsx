import { useEffect, useRef } from "react";
import * as go from "gojs";

const sampleData = {
  nodeDataArray: [
    // Queue Managers (groups)
    { key: "QM1", text: "QM_PRODUCTION", isGroup: true, category: "queueManager" },
    { key: "QM2", text: "QM_DEVELOPMENT", isGroup: true, category: "queueManager" },
    { key: "QM3", text: "QM_GATEWAY", isGroup: true, category: "queueManager" },

    // Queues inside QM1
    { key: "Q1", text: "APP.REQUEST.Q", group: "QM1", category: "queue" },
    { key: "Q2", text: "APP.REPLY.Q", group: "QM1", category: "queue" },
    { key: "Q3", text: "DLQ.PRODUCTION", group: "QM1", category: "queue" },
    { key: "Q4", text: "XMIT.QM_GATEWAY", group: "QM1", category: "queue", isTransmission: true },

    // Queues inside QM2
    { key: "Q5", text: "DEV.REQUEST.Q", group: "QM2", category: "queue" },
    { key: "Q6", text: "DEV.REPLY.Q", group: "QM2", category: "queue" },
    { key: "Q7", text: "DLQ.DEVELOPMENT", group: "QM2", category: "queue" },
    { key: "Q8", text: "XMIT.QM_GATEWAY", group: "QM2", category: "queue", isTransmission: true },

    // Queues inside QM3
    { key: "Q9", text: "GW.INBOUND.Q", group: "QM3", category: "queue" },
    { key: "Q10", text: "GW.OUTBOUND.Q", group: "QM3", category: "queue" },
    { key: "Q11", text: "DLQ.GATEWAY", group: "QM3", category: "queue" },
    { key: "Q12", text: "XMIT.QM_PROD", group: "QM3", category: "queue", isTransmission: true },
    { key: "Q13", text: "XMIT.QM_DEV", group: "QM3", category: "queue", isTransmission: true },
  ],
  linkDataArray: [
    // Channels between Queue Managers
    { from: "QM1", to: "QM3", text: "QM1.TO.GW", category: "channel" },
    { from: "QM3", to: "QM1", text: "GW.TO.QM1", category: "channel" },
    { from: "QM2", to: "QM3", text: "QM2.TO.GW", category: "channel" },
    { from: "QM3", to: "QM2", text: "GW.TO.QM2", category: "channel" },
  ],
};

export default function MQTopologyDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInstance = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!diagramRef.current) return;

    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, diagramRef.current, {
      "undoManager.isEnabled": true,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        layerSpacing: 120,
        columnSpacing: 40,
        setsPortSpots: false,
      }),
      initialAutoScale: go.AutoScale.Uniform,
      padding: 40,
    });

    // Queue Manager group template
    diagram.groupTemplateMap.add(
      "queueManager",
      $(
        go.Group,
        "Auto",
        {
          layout: $(go.GridLayout, {
            wrappingColumn: 2,
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(8, 8),
          }),
          padding: new go.Margin(28, 12, 12, 12),
          selectionAdornmentTemplate: $(
            go.Adornment,
            "Auto",
            $(go.Shape, "RoundedRectangle", {
              fill: null,
              stroke: "hsl(211, 68%, 40%)",
              strokeWidth: 2,
            }),
            $(go.Placeholder)
          ),
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
              font: "bold 13px 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
              stroke: "hsl(211, 68%, 30%)",
              margin: new go.Margin(0, 0, 0, 4),
            }, new go.Binding("text")),
          ),
          $(go.Placeholder, { padding: new go.Margin(4, 8, 8, 8) })
        )
      )
    );

    // Queue node template
    diagram.nodeTemplateMap.add(
      "queue",
      $(
        go.Node,
        "Auto",
        { margin: new go.Margin(2, 2, 2, 2) },
        $(go.Shape, "RoundedRectangle", {
          parameter1: 4,
          fill: "hsl(195, 55%, 92%)",
          stroke: "hsl(195, 50%, 55%)",
          strokeWidth: 1.5,
          minSize: new go.Size(140, 32),
        }, new go.Binding("fill", "isTransmission", (t) =>
          t ? "hsl(40, 80%, 92%)" : "hsl(195, 55%, 92%)"
        ), new go.Binding("stroke", "isTransmission", (t) =>
          t ? "hsl(40, 60%, 55%)" : "hsl(195, 50%, 55%)"
        )),
        $(go.TextBlock, {
          font: "11px 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
          stroke: "hsl(215, 30%, 20%)",
          margin: new go.Margin(6, 10, 6, 10),
        }, new go.Binding("text"))
      )
    );

    // Channel link template
    diagram.linkTemplateMap.add(
      "channel",
      $(
        go.Link,
        {
          routing: go.Routing.AvoidsNodes,
          corner: 12,
          curve: go.Curve.JumpOver,
        },
        $(go.Shape, {
          stroke: "hsl(211, 68%, 40%)",
          strokeWidth: 2.5,
        }),
        $(go.Shape, {
          toArrow: "Triangle",
          fill: "hsl(211, 68%, 40%)",
          stroke: null,
          scale: 1.2,
        }),
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
          }, new go.Binding("text"))
        )
      )
    );

    diagram.model = new go.GraphLinksModel(
      sampleData.nodeDataArray,
      sampleData.linkDataArray
    );

    diagramInstance.current = diagram;

    return () => {
      diagram.div = null;
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          IBM MQ Network Topology
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Queue managers, queues, and communication channels
        </p>
      </header>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 py-3 border-b border-border bg-card text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 rounded border-2" style={{ background: "hsl(211,60%,95%)", borderColor: "hsl(211,50%,70%)" }} />
          <span className="text-muted-foreground">Queue Manager</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 rounded border" style={{ background: "hsl(195,55%,92%)", borderColor: "hsl(195,50%,55%)" }} />
          <span className="text-muted-foreground">Queue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 rounded border" style={{ background: "hsl(40,80%,92%)", borderColor: "hsl(40,60%,55%)" }} />
          <span className="text-muted-foreground">Transmission Queue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 rounded" style={{ background: "hsl(211,68%,40%)" }} />
          <span className="text-muted-foreground">Channel</span>
        </div>
      </div>

      <div ref={diagramRef} className="flex-1 w-full" />
    </div>
  );
}
