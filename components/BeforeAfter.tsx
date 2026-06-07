"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";

interface Props {
  beforeUrl: string;
  afterUrl: string;
}

export default function BeforeAfter({ beforeUrl, afterUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [hinting, setHinting] = useState(true);
  const isDragging = useRef(false);

  // Brief left-right sweep on mount to teach the interaction
  useEffect(() => {
    const timers = [
      setTimeout(() => setPosition(32), 700),
      setTimeout(() => setPosition(68), 1300),
      setTimeout(() => setPosition(50), 1900),
      setTimeout(() => setHinting(false), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setHinting(false);
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-xl overflow-hidden select-none cursor-ew-resize shadow-xl touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* After image — base layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterUrl} alt="After restyling" className="w-full block" draggable={false} />

      {/* Before image — clipped to left portion */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: hinting ? "clip-path 0.55s ease-in-out" : "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt="Before restyling"
          className="w-full h-full object-cover absolute inset-0"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none"
        style={{
          left: `${position}%`,
          transition: hinting ? "left 0.55s ease-in-out" : "none",
        }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          left: `${position}%`,
          transition: hinting ? "left 0.55s ease-in-out" : "none",
        }}
      >
        <div className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text">
            <path
              d="M5 8H2m0 0l2-2M2 8l2 2M11 8h3m0 0l-2-2m2 2l-2 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="font-body text-[10px] tracking-widest uppercase text-white/90 bg-text/50 px-2 py-1 rounded backdrop-blur-sm">
          Before
        </span>
      </div>
      <div className="absolute top-3 right-3 pointer-events-none">
        <span className="font-body text-[10px] tracking-widest uppercase text-white/90 bg-text/50 px-2 py-1 rounded backdrop-blur-sm">
          After
        </span>
      </div>
    </motion.div>
  );
}
