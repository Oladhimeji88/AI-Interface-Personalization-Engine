import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are the AIPE assistant, the built-in AI advisor for the Omega AI Interface Personalization Engine.

You help users with:
- Understanding their behavioral insights and what the analytics mean
- Choosing and configuring themes (Quantum Dark, Neural Focus, Synapse Green, Minimal Light)
- Editing design tokens in the Live Editor (colors, typography, spacing, motion)
- Configuring the AI engine settings (response speed, confidence threshold)
- Interpreting adaptation history and behavioral patterns
- Getting the most out of personalization features

Respond concisely. Use markdown formatting — bold for key terms, bullet lists for options, code blocks for CSS token values. Keep replies focused and relevant to the Omega platform.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_api_key_here") {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured. Add your key to .env.local." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let messages: Array<{ role: "user" | "assistant"; content: string }>;
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const messageStream = anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages,
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
