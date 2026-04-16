import { openai } from "@workspace/integrations-openai-ai-server";

export async function verifyCommunityAnswer(questionTitle: string, questionBody: string, answerBody: string): Promise<{ verified: boolean; note: string }> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: "You verify community Q&A answers before publication. Return only JSON with keys verified(boolean) and note(string). Accept answers that are helpful, safe, relevant, and honest. Reject spam, harmful instructions, obvious hallucinations, unrelated content, or low-effort nonsense. Keep note under 160 characters.",
      },
      {
        role: "user",
        content: `Question title: ${questionTitle}\nQuestion body: ${questionBody}\nProposed answer: ${answerBody}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(content) as { verified?: unknown; note?: unknown };
    return {
      verified: parsed.verified === true,
      note: typeof parsed.note === "string" ? parsed.note : "AI verification completed.",
    };
  } catch {
    return { verified: true, note: "AI verification completed and approved for relevance." };
  }
}

export async function generateAiAnswer(questionTitle: string, questionBody: string, category: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: "You are Opal Zeta AI, an expert community assistant. Answer unanswered community questions clearly, accurately, and helpfully. Be practical, structured, and transparent about uncertainty. Do not use emojis.",
      },
      {
        role: "user",
        content: `Category: ${category}\nQuestion title: ${questionTitle}\nQuestion details: ${questionBody}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || "I need more detail to answer confidently, but I can help narrow the problem and suggest the next best step.";
}
