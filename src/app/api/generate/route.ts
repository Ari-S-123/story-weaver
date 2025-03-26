import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const systemPrompt =
  "You are a helpful writing assistant who is highly skilled in English language and literature. Your task is to help a user write their story. You will be given a context of the story and a prompt from the user. You will then generate an appropriate, thoughtful, helpful, and relevant response that perfectly addresses the specific directions or instructions provided within the user's prompt keeping in mind the context of the story. Please do not include any other text than the response to the prompt. Do not use markdown formatting.";

export async function POST(req: Request) {
  try {
    const { context, prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
    }

    const model = google("gemini-2.0-flash-001");

    const { text } = await generateText({
      model,
      prompt: "Context: " + context + " Prompt: " + prompt,
      system: systemPrompt
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
