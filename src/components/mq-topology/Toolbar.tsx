import { Plus, Trash2, Cable, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  onAddQueueManager: () => void;
  onAddQueue: () => void;
  onDelete: () => void;
  onToggleLinkDrawing: () => void;
  isLinkDrawing: boolean;
  hasSelection: boolean;
  hasGroupSelected: boolean;
}

export default function Toolbar({
  onAddQueueManager,
  onAddQueue,
  onDelete,
  onToggleLinkDrawing,
  isLinkDrawing,
  hasSelection,
  hasGroupSelected,
}: ToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2 px-6 py-2 border-b border-border bg-card">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" onClick={onAddQueueManager}>
              <Plus className="w-4 h-4 mr-1" />
              Queue Manager
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a new queue manager</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddQueue}
              disabled={!hasGroupSelected}
            >
              <Box className="w-4 h-4 mr-1" />
              Queue
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasGroupSelected
              ? "Add a queue to the selected queue manager"
              : "Select a queue manager first"}
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={isLinkDrawing ? "default" : "outline"}
              onClick={onToggleLinkDrawing}
            >
              <Cable className="w-4 h-4 mr-1" />
              Draw Channel
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isLinkDrawing
              ? "Click to stop drawing — currently active"
              : "Click, then drag between queue managers to draw a channel"}
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={onDelete}
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
