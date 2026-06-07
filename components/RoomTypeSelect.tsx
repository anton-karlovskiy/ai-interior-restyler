"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const ROOM_TYPES = ["living room", "bedroom", "kitchen", "dining room", "home office", "bathroom"];

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function RoomTypeSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="font-body text-xs tracking-widest uppercase text-muted">Room type</label>
      <ToggleGroup
        value={value ? [value] : []}
        onValueChange={(values) => {
          if (values.length > 0) onChange(values[0]!);
        }}
        className="flex flex-wrap gap-2 w-fit max-w-full"
      >
        {ROOM_TYPES.map((type) => (
          <ToggleGroupItem
            key={type}
            value={type}
            className="rounded-full px-3 py-1.5 h-auto text-xs font-body bg-surface border border-border text-muted hover:bg-surface-2 hover:border-muted hover:text-text aria-pressed:bg-text aria-pressed:text-bg aria-pressed:border-text transition-all duration-150"
          >
            {type}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
