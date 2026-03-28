import { useState, useCallback } from "react";
import * as go from "gojs";
import { Plus, Trash2, Cable, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { ViewType } from "@/types/mq-topology";

let nextQMId = 100;
let nextQId = 200;
let nextAppId = 300;

interface CanvasToolbarProps {
  diagram: go.Diagram | null;
  activeView: ViewType;
}

export default function CanvasToolbar({ diagram, activeView }: CanvasToolbarProps) {
  const [hasSelection, setHasSelection] = useState(false);
  const [hasGroupSelected, setHasGroupSelected] = useState(false);
  const [isLinkDrawing, setIsLinkDrawing] = useState(false);

  // Track selection via polling on diagram
  // We attach a listener when diagram changes
  useState(() => {
    // Will be set up via useEffect-like pattern below
  });

  // We need to attach listeners when diagram changes
  // Using a ref pattern
  const attachListeners = useCallback(
    (d: go.Diagram | null) => {
      if (!d) return;
      d.addDiagramListener("ChangedSelection", () => {
        const sel = d.selection;
        setHasSelection(sel.count > 0);
        setHasGroupSelected(sel.any((n) => n instanceof go.Group));
      });
    },
    []
  );

  // Attach on diagram change
  if (diagram && !(diagram as any).__toolbarListenerAttached) {
    attachListeners(diagram);
    (diagram as any).__toolbarListenerAttached = true;
  }

  const addQueueManager = useCallback(() => {
    if (!diagram) return;
    const id = `QM_NEW_${nextQMId++}`;
    diagram.startTransaction("add QM");
    diagram.model.addNodeData({
      key: id,
      label: "NEW_QM",
      isGroup: true,
      category: activeView === "architecture" ? "qm" : "queueManager",
    });
    diagram.commitTransaction("add QM");
    const node = diagram.findNodeForKey(id);
    if (node) {
      diagram.clearSelection();
      node.isSelected = true;
    }
  }, [diagram, activeView]);

  const addQueue = useCallback(() => {
    if (!diagram) return;
    const sel = diagram.selection.first();
    const group = sel instanceof go.Group ? sel : sel?.containingGroup;
    if (!group) return;
    const id = `Q_NEW_${nextQId++}`;
    diagram.startTransaction("add Queue");
    diagram.model.addNodeData({
      key: id,
      label: "NEW.QUEUE",
      group: group.key,
      category: "queue",
    });
    diagram.commitTransaction("add Queue");
  }, [diagram]);

  const addApp = useCallback(() => {
    if (!diagram) return;
    const id = `APP_NEW_${nextAppId++}`;
    diagram.startTransaction("add App");
    diagram.model.addNodeData({
      key: id,
      label: "NewService",
      category: "app",
    });
    diagram.commitTransaction("add App");
  }, [diagram]);

  const deleteSelected = useCallback(() => {
    if (!diagram) return;
    diagram.startTransaction("delete");
    diagram.commandHandler.deleteSelection();
    diagram.commitTransaction("delete");
  }, [diagram]);

  const toggleLinkDrawing = useCallback(() => {
    if (!diagram) return;
    const newVal = !isLinkDrawing;
    setIsLinkDrawing(newVal);

    diagram.startTransaction("toggle linking");
    diagram.toolManager.linkingTool.isEnabled = newVal;

    // Enable linking on groups/nodes depending on view
    diagram.nodes.each((n) => {
      if (n instanceof go.Group) {
        n.fromLinkable = newVal;
        n.toLinkable = newVal;
      }
    });
    // For non-architecture views, also enable on regular nodes
    if (activeView !== "architecture") {
      diagram.nodes.each((n) => {
        if (!(n instanceof go.Group)) {
          n.fromLinkable = newVal;
          n.toLinkable = newVal;
        }
      });
    }
    diagram.commitTransaction("toggle linking");
  }, [diagram, isLinkDrawing, activeView]);

  const showQMActions = activeView === "network" || activeView === "architecture";
  const showQueueActions = activeView === "architecture";
  const showAppActions = activeView === "dataflow" || activeView === "architecture";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2 px-6 py-2 border-b border-border bg-card">
        {showQMActions && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={addQueueManager}>
                <Plus className="w-4 h-4 mr-1" />
                Queue Manager
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add a new queue manager</TooltipContent>
          </Tooltip>
        )}

        {showQueueActions && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={addQueue}
                disabled={!hasGroupSelected}
              >
                <Box className="w-4 h-4 mr-1" />
                Queue
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hasGroupSelected ? "Add a queue to the selected group" : "Select a queue manager first"}
            </TooltipContent>
          </Tooltip>
        )}

        {showAppActions && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={addApp}>
                <Plus className="w-4 h-4 mr-1" />
                Application
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add a new application node</TooltipContent>
          </Tooltip>
        )}

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={isLinkDrawing ? "default" : "outline"}
              onClick={toggleLinkDrawing}
            >
              <Cable className="w-4 h-4 mr-1" />
              Draw Link
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isLinkDrawing ? "Click to stop drawing" : "Drag between nodes to draw a link"}
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={deleteSelected}
              disabled={!hasSelection}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete selected items</TooltipContent>
        </Tooltip>

        <span className="ml-auto text-xs text-muted-foreground">
          Double-click a label to rename
        </span>
      </div>
    </TooltipProvider>
  );
}
