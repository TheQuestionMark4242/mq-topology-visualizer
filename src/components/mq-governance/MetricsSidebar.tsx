import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const metrics = [
  {
    title: "Transmit Queue Load",
    description: "Current depth of transmission queues across queue managers",
  },
  {
    title: "Fan-in / Fan-out",
    description: "Number of producers and consumers per queue",
  },
  {
    title: "QM Coupling",
    description: "Degree of interconnection between queue managers",
  },
];

export default function MetricsSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Metrics</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {metrics.map((m) => (
          <Card key={m.title} className="bg-card">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs font-semibold text-foreground">{m.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold text-muted-foreground/40 mb-1">—</p>
              <CardDescription className="text-xs">{m.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
