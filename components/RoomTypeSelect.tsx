"use client";

const ROOM_TYPES = ["living room", "bedroom", "kitchen", "dining room", "home office", "bathroom"];

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function RoomTypeSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="font-body text-xs tracking-widest uppercase text-muted">Room type</label>
      <div className="flex flex-wrap gap-2">
        {ROOM_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-body transition-all duration-150 ${
              value === type
                ? "bg-text text-bg"
                : "bg-surface border border-border text-muted hover:border-muted hover:text-text"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
