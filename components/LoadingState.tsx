"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const CAPTIONS = [
  "Studying the room's light…",
  "Selecting materials…",
  "Styling the space…",
  "Arranging the furniture…",
  "Perfecting the details…",
  "Almost there…",
];

interface Props {
  previewUrl: string;
}

export default function LoadingState({ previewUrl }: Props) {
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCaptionIndex((i) => (i + 1) % CAPTIONS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt=""
        className="w-full object-cover opacity-40"
        style={{ maxHeight: "65vh" }}
      />

      {/* Shimmer sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      </div>

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-text/60 via-text/10 to-transparent" />

      {/* Caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={captionIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="font-display text-xl md:text-2xl text-bg/90 text-center"
          >
            {CAPTIONS[captionIndex]}
          </motion.p>
        </AnimatePresence>
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-bg/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
