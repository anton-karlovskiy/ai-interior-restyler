"use client";

import { motion } from "motion/react";
import { STYLES, type StylePreset } from "@/lib/styles";

interface Props {
  selected: StylePreset | null;
  onSelect: (style: StylePreset) => void;
}

export default function StylePicker({ selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl text-text">Choose a style</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {STYLES.map((style) => (
          <motion.button
            key={style.id}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            onClick={() => onSelect(style)}
            className={`rounded-lg overflow-hidden text-left transition-all duration-150 ${
              selected?.id === style.id
                ? "ring-2 ring-accent shadow-md"
                : "ring-1 ring-border hover:ring-muted hover:shadow-sm"
            }`}
          >
            <div className="h-16 w-full" style={{ background: style.gradient }} />
            <div className="px-2.5 py-2 bg-surface">
              <p className="font-body text-xs font-medium text-text">{style.name}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
