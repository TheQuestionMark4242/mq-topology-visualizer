import { useState, useRef } from "react";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { FlowRow } from "@/types/mq-topology";

interface CsvUploadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string, rows: FlowRow[]) => void;
}

const REQUIRED_COLUMNS = ["app_name", "queue_manager", "queue_name", "type"] as const;

export default function CsvUploadModal({ open, onClose, onConfirm }: CsvUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [parsed, setParsed] = useState<FlowRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setPreview([]);
    setParsed([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = (f: File) => {
    setError(null);
    setFile(f);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const headers = result.meta.fields ?? [];
        const missing = REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
        if (missing.length > 0) {
          setError(`Missing columns: ${missing.join(", ")}`);
          setPreview([]);
          setParsed([]);
          return;
        }

        const rows = result.data as Record<string, string>[];
        const invalid = rows.filter(
          (r) => r.type !== "producer" && r.type !== "consumer"
        );
        if (invalid.length > 0) {
          setError(
            `${invalid.length} row(s) have invalid "type" value. Must be "producer" or "consumer".`
          );
          setPreview([]);
          setParsed([]);
          return;
        }

        const flowRows: FlowRow[] = rows.map((r) => ({
          app_name: r.app_name,
          queue_manager: r.queue_manager,
          queue_name: r.queue_name,
          type: r.type as "producer" | "consumer",
        }));

        setParsed(flowRows);

        // Build preview: header + first 5 rows
        const previewLines: string[][] = [];
        previewLines.push([...REQUIRED_COLUMNS]);
        flowRows.slice(0, 5).forEach((r) => {
          previewLines.push([r.app_name, r.queue_manager, r.queue_name, r.type]);
        });
        setPreview(previewLines);
      },
      error: () => {
        setError("Failed to parse CSV file.");
      },
    });
  };

  const handleConfirm = () => {
    if (!file || parsed.length === 0) return;
    const name = file.name.replace(/\.csv$/i, "");
    onConfirm(name, parsed);
    reset();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Load CSV Topology</DialogTitle>
          <DialogDescription>
            Upload a CSV file to create a new topology from flow data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent"
          />

          <div className="rounded-md border border-border bg-muted/50 p-3 text-xs text-muted-foreground font-mono leading-relaxed">
            <p>Expected columns: app_name, queue_manager, queue_name, type</p>
            <p>type must be "producer" or "consumer"</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {preview.length > 0 && (
            <div className="rounded-md border border-border overflow-auto max-h-40">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-muted">
                    {preview[0].map((h) => (
                      <th key={h} className="px-2 py-1 text-left text-muted-foreground font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(1).map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((cell, j) => (
                        <td key={j} className="px-2 py-1 text-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsed.length > 5 && (
                <p className="text-xs text-muted-foreground px-2 py-1">
                  …and {parsed.length - 5} more row(s)
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={parsed.length === 0 || !!error}>
            Confirm ({parsed.length} rows)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
