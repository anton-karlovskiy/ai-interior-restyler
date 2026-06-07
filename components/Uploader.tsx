"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  onFileSelect: (file: File) => void;
  preview: string | null;
}

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export default function Uploader({ onFileSelect, preview }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPT.includes(file.type)) {
        setValidationError("Please upload a JPEG, PNG, or WebP image.");
        return;
      }
      setValidationError(null);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Uploaded room"
          className="w-full object-cover"
          style={{ maxHeight: "55vh" }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute top-3 right-3 bg-text/70 text-bg text-xs font-body px-3 py-1.5 rounded-full hover:bg-text transition-colors backdrop-blur-sm"
        >
          Change photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-14 md:p-20 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-accent bg-accent/5 scale-[1.01]"
          : "border-border hover:border-muted hover:bg-surface"
      }`}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
      <div className="space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full border border-border flex items-center justify-center bg-surface">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted">
            <path
              d="M10 3v10M6 7l4-4 4 4M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-body text-text font-medium">Drop your room photo here</p>
          <p className="font-body text-muted text-sm mt-1">or click to browse · JPEG, PNG, WebP</p>
        </div>
      </div>
      {validationError && <p className="mt-4 text-accent text-sm font-body">{validationError}</p>}
    </div>
  );
}
