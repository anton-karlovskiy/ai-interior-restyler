"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function DetailsInput({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="font-body text-xs tracking-widest uppercase text-muted">
        Details <span className="normal-case tracking-normal text-muted/60">(optional)</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="e.g. keep the fireplace, add more plants, darker wood tones…"
        className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-body text-sm text-text placeholder:text-muted/50 resize-none focus:outline-none focus:ring-1 focus:ring-accent transition-shadow"
      />
    </div>
  );
}
