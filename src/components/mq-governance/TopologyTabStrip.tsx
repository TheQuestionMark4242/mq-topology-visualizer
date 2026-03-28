import { useState, useRef, useEffect } from "react";
import { Plus, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Topology } from "@/types/mq-topology";

interface TopologyTabStripProps {
  topologies: Topology[];
  activeTopologyId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onClone: () => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

function TabItem({
  topology,
  isActive,
  onSelect,
  onRename,
  onRemove,
  canRemove,
}: {
  topology: Topology;
  isActive: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(topology.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed) onRename(trimmed);
    setEditing(false);
  };

  return (
    <button
      onClick={onSelect}
      onDoubleClick={() => {
        setDraft(topology.name);
        setEditing(true);
      }}
      className={`group relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-md border border-b-0 transition-colors whitespace-nowrap ${
        isActive
          ? "bg-card text-foreground border-border -mb-px z-10"
          : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
      }`}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="bg-transparent border-b border-primary outline-none w-28 text-sm text-foreground"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="max-w-[140px] truncate">{topology.name}</span>
      )}
      {canRemove && !editing && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </button>
  );
}

export default function TopologyTabStrip({
  topologies,
  activeTopologyId,
  onSelect,
  onAdd,
  onClone,
  onRename,
  onRemove,
}: TopologyTabStripProps) {
  return (
    <div className="flex items-end gap-1 px-4 pt-2">
      {topologies.map((t) => (
        <TabItem
          key={t.id}
          topology={t}
          isActive={t.id === activeTopologyId}
          onSelect={() => onSelect(t.id)}
          onRename={(name) => onRename(t.id, name)}
          onRemove={() => onRemove(t.id)}
          canRemove={topologies.length > 1}
        />
      ))}
      <div className="flex items-center gap-1 ml-2 mb-1">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onAdd}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          New
        </Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onClone}>
          <Copy className="w-3.5 h-3.5 mr-1" />
          Clone
        </Button>
      </div>
    </div>
  );
}
