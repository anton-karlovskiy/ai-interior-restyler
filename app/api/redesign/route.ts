import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { STYLES } from "@/lib/styles";

const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.0-flash-preview-image-generation";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB base64 limit

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function callGemini(prompt: string, image: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: MODEL,
    config: { responseModalities: ["TEXT", "IMAGE"] },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, { inlineData: { mimeType, data: image } }],
      },
    ],
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      return { data: part.inlineData.data, mimeType: part.inlineData.mimeType ?? "image/png" };
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, mimeType, style, roomType, details } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }
    if (image.length > MAX_IMAGE_BYTES * 1.4) {
      return NextResponse.json(
        { error: "Image is too large. Please use a smaller photo." },
        { status: 400 },
      );
    }

    const preset = STYLES.find((s) => s.id === style);
    if (!preset) {
      return NextResponse.json({ error: "Invalid style selected." }, { status: 400 });
    }

    const validRoomType =
      typeof roomType === "string" && roomType.trim() ? roomType.trim() : "room";
    const validDetails = typeof details === "string" ? details : undefined;
    const prompt = buildPrompt(preset.prompt, validRoomType, validDetails);

    let result = await callGemini(prompt, image, mimeType ?? "image/jpeg");

    if (!result) {
      result = await callGemini(prompt, image, mimeType ?? "image/jpeg");
    }

    if (!result) {
      return NextResponse.json(
        { error: "The AI didn't return an image. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ image: `data:${result.mimeType};base64,${result.data}` });
  } catch (err) {
    console.error("[/api/redesign]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 },
    );
  }
}
