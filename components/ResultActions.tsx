"use client";

import { Button } from "@/components/ui/button";

interface Props {
  resultUrl: string;
  onRegenerate: () => void;
  onReset: () => void;
}

export default function ResultActions({ resultUrl, onRegenerate, onReset }: Props) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "restyled-room.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex items-center gap-2.5 pt-4">
      <Button
        onClick={handleDownload}
        className="flex-1 h-auto py-3.5 rounded-xl font-body text-sm font-medium bg-text text-bg hover:bg-text hover:opacity-90"
      >
        Download
      </Button>
      <Button
        variant="outline"
        onClick={onRegenerate}
        className="flex-1 h-auto py-3.5 rounded-xl font-body text-sm text-muted hover:bg-surface hover:text-text hover:border-border"
      >
        Regenerate
      </Button>
      <Button
        variant="outline"
        onClick={onReset}
        className="flex-1 h-auto py-3.5 rounded-xl font-body text-sm text-muted hover:bg-surface hover:text-text hover:border-border"
      >
        New photo
      </Button>
    </div>
  );
}
