const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
// Use vite proxy to avoid CORS issues in development
const OPENAI_URL = "/api/v1/chat/completions";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function streamChatCompletion(
  messages: ChatMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI error:", response.status, errorText);
    if (response.status === 429) throw new Error("Rate limit exceeded");
    if (response.status === 402) throw new Error("Payment required");
    throw new Error(`OpenAI error: ${response.status}`);
  }

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") return;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onChunk(content);
      } catch {
        // ignore parse errors
      }
    }
  }
}

const subjectPrompts: Record<string, string> = {
  math: `You are an expert MATH tutor. Focus on:
- Clear step-by-step solutions with formulas
- Explain WHY each step works
- Include worked examples with actual numbers
- Mention common mistakes to avoid
- Suggest practice problems`,
  science: `You are an expert SCIENCE tutor. Focus on:
- Real-world examples students can relate to
- Break down complex processes into simple steps
- Explain cause and effect relationships
- Reference everyday phenomena`,
  coding: `You are an expert CODING tutor. Focus on:
- Clear, well-commented code examples
- Explain what each part of the code does
- Show practical implementation
- Mention best practices and common errors`,
  english: `You are an expert ENGLISH tutor. Focus on:
- Grammar rules and their usage
- Clear examples in sentences
- Include synonyms and related vocabulary`,
  history: `You are an expert HISTORY tutor. Focus on:
- Clear chronological context
- Explain causes and consequences
- Connect events to their broader impact`,
  general: `You are a knowledgeable tutor covering all academic subjects.`,
};

export const baseSystemPrompt = `You are StudyAI, a friendly and helpful AI study assistant. Your goal is to help students understand concepts clearly.

FORMATTING RULES:
1. Write ONLY in plain text. No Markdown, no special characters like #, *, -.
2. Use line breaks between sections for readability.
3. For numbered steps, write them as "Step 1:", "Step 2:", etc.

RESPONSE STRUCTURE:
Start with a simple, friendly explanation of the concept in 2-3 sentences.

Then provide step-by-step explanation:
Step 1: [First step with explanation]
Step 2: [Second step with explanation]

Then give a clear example with actual values or scenarios.

End with:
Key takeaways: Write 2-3 important points to remember.
What to learn next: Suggest 2-3 related topics.
Practice suggestion: Give a similar problem for the student to try.

GUIDELINES:
- Use student-friendly language
- Be encouraging and supportive
- Focus on UNDERSTANDING, not just providing answers
- Always explain WHY something works, not just HOW`;

export function getSystemPrompt(subjectMode?: string, toolType?: string): string {
  if (toolType === "formula") {
    return `You are a formula explainer. Write in plain text only.
When given a formula:
1. State the formula clearly
2. Explain what each variable means
3. Explain when and how to use it
4. Give a simple example with actual numbers
5. Mention common mistakes to avoid`;
  }
  if (toolType === "definition") {
    return `You are a definition finder. Write in plain text only.
When given a term:
1. Give a clear, simple definition in one or two sentences
2. Provide the context or subject area
3. Give an example of how it is used
4. List 2-3 related terms the student should know`;
  }
  if (toolType === "simplify") {
    return `You are a concept simplifier. Explain as if talking to a 12-year-old.
1. Use simple, everyday words
2. Use relatable analogies from daily life
3. Avoid jargon completely
4. Make it fun and memorable
5. End with a simple one-sentence summary`;
  }
  if (toolType === "notes") {
    return `You are a revision notes generator. Write in plain text only.
Create concise study notes:
1. Key concept in one sentence
2. Three to five important facts written as complete sentences
3. One memorable example or tip
4. A quick summary for last-minute revision`;
  }

  if (subjectMode && subjectPrompts[subjectMode]) {
    return subjectPrompts[subjectMode] + "\n\n" + baseSystemPrompt;
  }
  return baseSystemPrompt;
}
