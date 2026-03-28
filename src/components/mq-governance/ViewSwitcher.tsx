import type { ViewType } from "@/types/mq-topology";
import { Network, GitBranch, Layers } from "lucide-react";

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { key: ViewType; label: string; icon: typeof Network }[] = [
  { key: "network", label: "Network", icon: Network },
  { key: "dataflow", label: "Data Flow", icon: GitBranch },
  { key: "architecture", label: "Architecture", icon: Layers },
];

export default function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card">
      {views.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onViewChange(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeView === key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
