/**
 * Gemini API integration helper (optional real API call if VITE_GEMINI_API_KEY exists)
 * Falls back silently to deterministic Demo Mode.
 */

export const IS_DEMO_MODE = !import.meta.env.VITE_GEMINI_API_KEY;

export async function callGeminiIfAvailable(
  prompt: string,
  systemInstruction?: string
): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      systemInstruction: systemInstruction
        ? {
            parts: [{ text: systemInstruction }]
          }
        : undefined,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to Demo Mode:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn('Gemini API error, falling back to Demo Mode:', err);
    return null;
  }
}
