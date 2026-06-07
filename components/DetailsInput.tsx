"use client";

import { Textarea } from "@/components/ui/textarea";

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
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="e.g. keep the fireplace, add more plants, darker wood tones…"
        className="font-body text-sm bg-surface resize-none"
      />
    </div>
  );
}
