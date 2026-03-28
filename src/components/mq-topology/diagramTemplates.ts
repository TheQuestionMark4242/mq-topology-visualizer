import * as go from "gojs";

const $ = go.GraphObject.make;

export function createGroupTemplate() {
  return $(
    go.Group,
    "Auto",
    {
      layout: $(go.GridLayout, {
        wrappingColumn: 2,
        cellSize: new go.Size(1, 1),
        spacing: new go.Size(8, 8),
      }),
      padding: new go.Margin(28, 12, 12, 12),
      ungroupable: true,
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
          editable: true,
        }, new go.Binding("text").makeTwoWay()),
      ),
      $(go.Placeholder, { padding: new go.Margin(4, 8, 8, 8) })
    )
  );
}

export function createNodeTemplate() {
  return $(
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
      editable: true,
    }, new go.Binding("text").makeTwoWay())
  );
}

export function createLinkTemplate() {
  return $(
    go.Link,
    {
      routing: go.Routing.AvoidsNodes,
      corner: 12,
      curve: go.Curve.JumpOver,
      relinkableFrom: true,
      relinkableTo: true,
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
        editable: true,
      }, new go.Binding("text").makeTwoWay())
    )
  );
}
