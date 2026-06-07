"use client";

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
      <button
        onClick={handleDownload}
        className="flex-1 bg-text text-bg font-body text-sm font-medium py-3.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        Download
      </button>
      <button
        onClick={onRegenerate}
        className="flex-1 border border-border font-body text-sm py-3.5 rounded-xl text-muted hover:bg-surface hover:text-text transition-all"
      >
        Regenerate
      </button>
      <button
        onClick={onReset}
        className="flex-1 border border-border font-body text-sm py-3.5 rounded-xl text-muted hover:bg-surface hover:text-text transition-all"
      >
        New photo
      </button>
    </div>
  );
}
