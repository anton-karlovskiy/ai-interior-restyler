"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hero from "@/components/Hero";
import Uploader from "@/components/Uploader";
import StylePicker from "@/components/StylePicker";
import RoomTypeSelect from "@/components/RoomTypeSelect";
import DetailsInput from "@/components/DetailsInput";
import GenerateButton from "@/components/GenerateButton";
import LoadingState from "@/components/LoadingState";
import BeforeAfter from "@/components/BeforeAfter";
import ResultActions from "@/components/ResultActions";
import ExampleGallery from "@/components/ExampleGallery";
import { resizeAndCompress } from "@/lib/image";
import type { StylePreset } from "@/lib/styles";

type Phase = "idle" | "loading" | "result";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [roomType, setRoomType] = useState("living room");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setUploadedPreview(url);
    setResult(null);
    setError(null);
    setPhase("idle");
  }, []);

  const runGenerate = async (file: File, style: StylePreset) => {
    setPhase("loading");
    setError(null);
    try {
      const { base64, mimeType } = await resizeAndCompress(file);
      const res = await fetch("/api/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mimeType,
          style: style.id,
          roomType,
          details,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.image);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPhase("idle");
    }
  };

  const handleGenerate = () => {
    if (!uploadedFile || !selectedStyle) return;
    runGenerate(uploadedFile, selectedStyle);
  };

  const handleRegenerate = () => {
    if (!uploadedFile || !selectedStyle) return;
    runGenerate(uploadedFile, selectedStyle);
  };

  const handleReset = () => {
    setPhase("idle");
    setUploadedFile(null);
    setUploadedPreview(null);
    setSelectedStyle(null);
    setResult(null);
    setError(null);
    setDetails("");
  };

  return (
    <main className="min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-8 pb-24">
        <AnimatePresence mode="wait">
          {phase === "loading" && uploadedPreview && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingState previewUrl={uploadedPreview} />
            </motion.div>
          )}

          {phase === "result" && result && uploadedPreview && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-3xl mx-auto space-y-2"
            >
              <BeforeAfter beforeUrl={uploadedPreview} afterUrl={result} />
              <ResultActions
                resultUrl={result}
                onRegenerate={handleRegenerate}
                onReset={handleReset}
              />
            </motion.div>
          )}

          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {uploadedPreview ? (
                /* Configuring state: 2-column layout */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Left: image preview */}
                  <div className="lg:sticky lg:top-8">
                    <Uploader onFileSelect={handleFileSelect} preview={uploadedPreview} />
                  </div>

                  {/* Right: controls */}
                  <div className="space-y-6">
                    <StylePicker selected={selectedStyle} onSelect={setSelectedStyle} />
                    <RoomTypeSelect value={roomType} onChange={setRoomType} />
                    <DetailsInput value={details} onChange={setDetails} />
                    {error && (
                      <p className="font-body text-sm text-accent bg-accent/8 border border-accent/20 rounded-lg px-4 py-3">
                        {error}
                      </p>
                    )}
                    <GenerateButton
                      disabled={!uploadedFile || !selectedStyle}
                      onClick={handleGenerate}
                    />
                    {!selectedStyle && (
                      <p className="font-body text-xs text-muted/70 text-center">
                        Select a style to continue
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty state: upload zone + example gallery */
                <div className="max-w-xl mx-auto space-y-10">
                  <Uploader onFileSelect={handleFileSelect} preview={null} />
                  <ExampleGallery />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
