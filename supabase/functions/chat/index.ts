import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
- Reference everyday phenomena
- Suggest experiments or observations students can try`,
  
  coding: `You are an expert CODING tutor. Focus on:
- Clear, well-commented code examples
- Explain what each part of the code does
- Show practical implementation
- Mention best practices and common errors
- Suggest coding exercises to practice`,
  
  english: `You are an expert ENGLISH tutor. Focus on:
- Grammar rules and their usage
- Clear examples in sentences
- Explain meanings and context
- Include synonyms and related vocabulary
- Give writing tips when relevant`,
  
  history: `You are an expert HISTORY tutor. Focus on:
- Clear chronological context
- Explain causes and consequences
- Connect events to their broader impact
- Include interesting facts to aid memory
- Relate historical events to modern relevance`,
  
  general: `You are a knowledgeable tutor covering all academic subjects.`
};

const baseSystemPrompt = `You are StudyAI, a friendly and helpful AI study assistant created by Saim Adeel. Your goal is to help students understand concepts clearly and practically.

CRITICAL FORMATTING RULES - YOU MUST FOLLOW THESE:
1. Write ONLY in plain text. Never use Markdown formatting.
2. Do NOT use any special characters like #, *, -, bullet points, or headers.
3. Do NOT use bold, italic, or any text formatting.
4. Write in natural paragraphs with clear sentences.
5. Use line breaks between sections for readability.
6. For numbered steps, write them as "Step 1:", "Step 2:", etc.
7. For lists, write complete sentences on separate lines.

RESPONSE STRUCTURE - Follow this for every answer:

Start with a simple, friendly explanation of the concept in 2-3 sentences that a student can easily understand.

Then provide step-by-step explanation:
Step 1: [First step with explanation]
Step 2: [Second step with explanation]
(Continue as needed)

Then give a clear example that illustrates the concept with actual values or scenarios.

End with:
Key takeaways: Write 2-3 important points to remember as complete sentences.
What to learn next: Suggest 2-3 related topics the student should explore.
Practice suggestion: Give a similar problem or exercise for the student to try.

GUIDELINES:
- Use student-friendly language that is easy to understand
- Be encouraging and supportive in your tone
- Focus on UNDERSTANDING, not just providing answers
- Keep explanations concise but complete
- If it is a problem, show the full solution process clearly
- Always explain WHY something works, not just HOW`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not configured');
      throw new Error('API key is not configured');
    }

    const { messages, subjectMode, toolType } = await req.json();
    console.log('Received messages:', messages.length, 'Subject mode:', subjectMode, 'Tool type:', toolType);

    // Build system prompt based on mode and tool type
    let finalSystemPrompt = baseSystemPrompt;
    
    if (subjectMode && subjectPrompts[subjectMode]) {
      finalSystemPrompt = subjectPrompts[subjectMode] + "\n\n" + baseSystemPrompt;
    }

    // Special prompts for quick study tools
    if (toolType === 'formula') {
      finalSystemPrompt = `You are a formula explainer. Write in plain text only, no special characters or formatting.

When given a formula:
1. State the formula clearly
2. Explain what each variable or symbol means
3. Explain when and how to use it
4. Give a simple example with actual numbers
5. Mention common mistakes to avoid

Keep it concise and student-friendly. Do not use any Markdown, bullets, or special characters.`;
    } else if (toolType === 'definition') {
      finalSystemPrompt = `You are a definition finder. Write in plain text only, no special characters or formatting.

When given a term:
1. Give a clear, simple definition in one or two sentences
2. Provide the context or subject area it belongs to
3. Give an example of how it is used
4. List 2-3 related terms the student should know

Keep definitions brief and memorable. Do not use any Markdown, bullets, or special characters.`;
    } else if (toolType === 'simplify') {
      finalSystemPrompt = `You are a concept simplifier. Write in plain text only, no special characters or formatting.

Explain the concept as if talking to a 12-year-old:
1. Use simple, everyday words
2. Use relatable analogies from daily life
3. Avoid jargon completely
4. Make it fun and memorable
5. End with a simple one-sentence summary

Your goal is to make ANY concept understandable. Do not use any Markdown, bullets, or special characters.`;
    } else if (toolType === 'notes') {
      finalSystemPrompt = `You are a revision notes generator. Write in plain text only, no special characters or formatting.

Create concise study notes:
1. Key concept in one sentence
2. Three to five important facts written as complete sentences
3. One memorable example or tip
4. A quick summary for last-minute revision

Keep it scannable and easy to review. Do not use any Markdown, bullets, or special characters.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error: unknown) {
    console.error('Error in chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
