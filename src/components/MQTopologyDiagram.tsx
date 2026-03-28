import { useEffect, useRef, useState, useCallback } from "react";
import * as go from "gojs";
import { sampleData } from "./mq-topology/sampleData";
import {
  createGroupTemplate,
  createNodeTemplate,
  createLinkTemplate,
} from "./mq-topology/diagramTemplates";
import Toolbar from "./mq-topology/Toolbar";

let nextQMId = 100;
let nextQId = 200;

export default function MQTopologyDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInstance = useRef<go.Diagram | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [hasGroupSelected, setHasGroupSelected] = useState(false);
  const [isLinkDrawing, setIsLinkDrawing] = useState(false);

  useEffect(() => {
    if (!diagramRef.current) return;

    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, diagramRef.current, {
      "undoManager.isEnabled": true,
      "commandHandler.deletesTree": false,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        layerSpacing: 120,
        columnSpacing: 40,
        setsPortSpots: false,
      }),
      initialAutoScale: go.AutoScale.Uniform,
      padding: 40,
      // Allow linking from groups (queue managers) only
      "linkingTool.isEnabled": false,
      "linkingTool.direction": go.LinkingDirection.ForwardsOnly,
      "linkingTool.archetypeLinkData": { category: "channel", text: "NEW.CHANNEL" },
      // Validate links: only between queue manager groups
      "linkingTool.linkValidation": (
        fromNode: go.GraphObject,
        _fromPort: go.GraphObject,
        toNode: go.GraphObject
      ) => {
        return (
          fromNode instanceof go.Group &&
          toNode instanceof go.Group &&
          fromNode !== toNode
        );
      },
    });

    diagram.groupTemplateMap.add("queueManager", createGroupTemplate());
    diagram.nodeTemplateMap.add("queue", createNodeTemplate());
    diagram.linkTemplateMap.add("channel", createLinkTemplate());

    // Make groups linkable when link drawing is active
    diagram.groupTemplateMap.get("queueManager")!.fromLinkable = false;
    diagram.groupTemplateMap.get("queueManager")!.toLinkable = false;

    // Track selection changes
    diagram.addDiagramListener("ChangedSelection", () => {
      const sel = diagram.selection;
      setHasSelection(sel.count > 0);
      setHasGroupSelected(sel.any((n) => n instanceof go.Group));
    });

    diagram.model = new go.GraphLinksModel(
      sampleData.nodeDataArray,
      sampleData.linkDataArray
    );

    diagramInstance.current = diagram;

    return () => {
      diagram.div = null;
    };
  }, []);

  const addQueueManager = useCallback(() => {
    const diagram = diagramInstance.current;
    if (!diagram) return;
    const id = `QM_NEW_${nextQMId++}`;
    diagram.startTransaction("add QM");
    diagram.model.addNodeData({
      key: id,
      text: "NEW_QM",
      isGroup: true,
      category: "queueManager",
    });
    diagram.commitTransaction("add QM");
    // Select the new group
    const newGroup = diagram.findNodeForKey(id);
    if (newGroup) {
      diagram.clearSelection();
      newGroup.isSelected = true;
    }
  }, []);

  const addQueue = useCallback(() => {
    const diagram = diagramInstance.current;
    if (!diagram) return;
    const sel = diagram.selection.first();
    const group = sel instanceof go.Group ? sel : sel?.containingGroup;
    if (!group) return;
    const id = `Q_NEW_${nextQId++}`;
    diagram.startTransaction("add Queue");
    diagram.model.addNodeData({
      key: id,
      text: "NEW.QUEUE",
      group: group.key,
      category: "queue",
    });
    diagram.commitTransaction("add Queue");
  }, []);

  const deleteSelected = useCallback(() => {
    const diagram = diagramInstance.current;
    if (!diagram) return;
    diagram.startTransaction("delete");
    diagram.commandHandler.deleteSelection();
    diagram.commitTransaction("delete");
  }, []);

  const toggleLinkDrawing = useCallback(() => {
    const diagram = diagramInstance.current;
    if (!diagram) return;
    const newVal = !isLinkDrawing;
    setIsLinkDrawing(newVal);

    diagram.startTransaction("toggle linking");
    // Enable/disable the linking tool
    diagram.toolManager.linkingTool.isEnabled = newVal;
    // Make groups linkable or not
    const tmpl = diagram.groupTemplateMap.get("queueManager");
    if (tmpl) {
      tmpl.fromLinkable = newVal;
      tmpl.toLinkable = newVal;
    }
    // Update all existing groups
    diagram.groups.each((g) => {
      if (g.category === "queueManager") {
        g.fromLinkable = newVal;
        g.toLinkable = newVal;
      }
    });
    diagram.commitTransaction("toggle linking");

    // Change cursor
    if (diagramRef.current) {
      diagramRef.current.style.cursor = newVal ? "crosshair" : "";
    }
  }, [isLinkDrawing]);

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

      <Toolbar
        onAddQueueManager={addQueueManager}
        onAddQueue={addQueue}
        onDelete={deleteSelected}
        onToggleLinkDrawing={toggleLinkDrawing}
        isLinkDrawing={isLinkDrawing}
        hasSelection={hasSelection}
        hasGroupSelected={hasGroupSelected}
      />

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
