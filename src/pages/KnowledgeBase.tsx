import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Upload, FileText, File, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const documents = [
  { id: "1", name: "Product FAQ.pdf", size: "2.4 MB", pages: 24, status: "live" as const, lastSync: "2 hrs ago" },
  { id: "2", name: "Pricing Guide.docx", size: "1.1 MB", pages: 8, status: "live" as const, lastSync: "1 day ago" },
  { id: "3", name: "Onboarding Script.txt", size: "45 KB", pages: 3, status: "live" as const, lastSync: "3 days ago" },
  { id: "4", name: "New Features 2026.pdf", size: "3.8 MB", pages: 15, status: "paused" as const, lastSync: "Syncing..." },
];

export default function KnowledgeBase() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">Upload documents for agent reference</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Upload Document</Button>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="rounded-lg bg-primary/10 p-2.5">
                {doc.name.endsWith(".pdf") ? <FileText className="h-5 w-5 text-primary" /> : <File className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.size} · {doc.pages} pages</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{doc.lastSync}</span>
                <StatusBadge status={doc.status} />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={BookOpen} title="No documents yet" description="Upload documents that your agents can reference during calls." actionLabel="Upload Document" onAction={() => {}} />
      )}
    </div>
  );
}
