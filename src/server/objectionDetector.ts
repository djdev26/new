import { GoogleGenAI } from '@google/genai';
import { ObjectionResult, ObjectionType } from '../types/salespilot';
import { isGeminiAvailable, executeWithTimeout } from './geminiClient';

export function detectObjectionsDeterministic(turn: string): ObjectionResult {
  const lower = turn.toLowerCase();
  const objections: ObjectionResult['objections'] = [];

  // Pricing Objection
  if (
    lower.includes('expensive') ||
    lower.includes('costly') ||
    lower.includes('too high') ||
    lower.includes('cheaper') ||
    lower.includes('over budget') ||
    lower.includes('cant afford') ||
    lower.includes('discount') ||
    lower.includes('less expensive')
  ) {
    objections.push({
      type: 'pricing',
      excerpt: turn,
      severity: lower.includes('cant afford') || lower.includes('way too high') ? 'high' : 'medium',
    });
  }

  // Competitor Objection
  if (
    lower.includes('competitor') ||
    lower.includes('competitor x') ||
    lower.includes('alternative') ||
    lower.includes('already looking at') ||
    lower.includes('other vendor') ||
    lower.includes('why should i pay you')
  ) {
    objections.push({
      type: 'competitor',
      excerpt: turn,
      severity: 'medium',
    });
  }

  // Timing Objection
  if (
    lower.includes('timeline') ||
    lower.includes('too fast') ||
    lower.includes('too slow') ||
    lower.includes('not ready') ||
    lower.includes('next quarter') ||
    lower.includes('later') ||
    lower.includes('delay') ||
    lower.includes('realistic')
  ) {
    objections.push({
      type: 'timing',
      excerpt: turn,
      severity: lower.includes('not ready') ? 'high' : 'low',
    });
  }

  // Trust Objection
  if (
    lower.includes('security') ||
    lower.includes('compliance') ||
    lower.includes('data breach') ||
    lower.includes('privacy') ||
    lower.includes('soc2') ||
    lower.includes('safe')
  ) {
    objections.push({
      type: 'trust',
      excerpt: turn,
      severity: 'medium',
    });
  }

  // Feature Gap Objection
  if (
    lower.includes('missing') ||
    lower.includes('does it support') ||
    lower.includes('lack') ||
    lower.includes('cannot do') ||
    lower.includes('integrate with')
  ) {
    objections.push({
      type: 'feature-gap',
      excerpt: turn,
      severity: 'low',
    });
  }

  return { objections };
}

export async function detectObjections(turn: string): Promise<ObjectionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !isGeminiAvailable()) {
    return detectObjectionsDeterministic(turn);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Inspect this customer turn for sales objections.
Categories must be one of: "pricing", "trust", "competitor", "feature-gap", "timing", "other".
Turn: "${turn}"

Return ONLY JSON:
{
  "objections": [
    {
      "type": "pricing" | "trust" | "competitor" | "feature-gap" | "timing" | "other",
      "excerpt": string,
      "severity": "low" | "medium" | "high"
    }
  ]
}`;

    const response = await executeWithTimeout(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    if (Array.isArray(parsed.objections)) {
      return parsed;
    }
  } catch (error) {
    // Graceful fallback without delay
  }

  return detectObjectionsDeterministic(turn);
}
