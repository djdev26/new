import { GoogleGenAI } from '@google/genai';
import { IntentResult, SentimentType, BuyingSignal, UrgencyLevel } from '../types/salespilot';
import { isGeminiAvailable, executeWithTimeout } from './geminiClient';

// Fallback rule-based intent detection engine
export function detectIntentDeterministic(turn: string, history: string[] = []): IntentResult {
  const lower = turn.toLowerCase();

  let detected_intent = 'General Inquiry';
  let confidence = 75;
  let sentiment: SentimentType = 'neutral';
  let buying_signal: BuyingSignal = 'medium';
  let urgency: UrgencyLevel = 'medium';

  // Pricing Inquiry / Negotiation
  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('tier') || lower.includes('discount') || lower.includes('budget') || lower.includes('how much') || lower.includes('per seat') || lower.includes('per user')) {
    detected_intent = 'Pricing & Commercial Terms';
    confidence = 94;
    sentiment = 'interested';
    buying_signal = 'high';
    urgency = 'medium';
  }

  // Competitor Inquiry
  else if (lower.includes('competitor') || lower.includes('alternative') || lower.includes('cheaper') || lower.includes('vs') || lower.includes('better than')) {
    detected_intent = 'Competitor Comparison & Defense';
    confidence = 92;
    sentiment = 'neutral';
    buying_signal = 'medium';
    urgency = 'high';
  }

  // User Scale / Seat Sizing
  else if (lower.includes('users') || lower.includes('seats') || lower.includes('reps') || lower.includes('team size') || /\b\d+\s*(users|seats|reps|people)\b/.test(lower)) {
    detected_intent = 'Capacity & Seat Sizing';
    confidence = 96;
    sentiment = 'interested';
    buying_signal = 'high';
    urgency = 'medium';
  }

  // Demo / Meeting Booking
  else if (lower.includes('demo') || lower.includes('meeting') || lower.includes('book') || lower.includes('schedule') || lower.includes('calendar') || lower.includes('call') || lower.includes('architect') || lower.includes('tuesday') || lower.includes('next week')) {
    detected_intent = 'Demo Booking Request';
    confidence = 98;
    sentiment = 'positive';
    buying_signal = 'high';
    urgency = 'high';
  }

  // Timeline / Implementation
  else if (lower.includes('timeline') || lower.includes('weeks') || lower.includes('days') || lower.includes('setup') || lower.includes('onboarding') || lower.includes('implementation') || lower.includes('roll out') || lower.includes('urgent')) {
    detected_intent = 'Implementation Timeline';
    confidence = 88;
    sentiment = 'interested';
    buying_signal = 'high';
    urgency = 'high';
  }

  // Human Escalation
  else if (lower.includes('human') || lower.includes('real person') || lower.includes('speak to manager') || lower.includes('representative') || lower.includes('transfer me')) {
    detected_intent = 'Human Agent Escalation';
    confidence = 95;
    sentiment = 'neutral';
    buying_signal = 'medium';
    urgency = 'high';
  }

  // Objections
  else if (lower.includes('expensive') || lower.includes('too high') || lower.includes('cant afford') || lower.includes('not sure') || lower.includes('doubt') || lower.includes('concerned')) {
    detected_intent = 'Commercial Objection';
    confidence = 90;
    sentiment = 'negative';
    buying_signal = 'medium';
    urgency = 'high';
  }

  return {
    current_intent: detected_intent,
    detected_intent,
    confidence,
    sentiment,
    buying_signal,
    urgency,
  };
}

/**
 * High-performance intent detector: uses Gemini LLM when GEMINI_API_KEY is present,
 * with instantaneous deterministic rule fallback.
 */
export async function detectIntent(turn: string, history: string[] = []): Promise<IntentResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !isGeminiAvailable()) {
    return detectIntentDeterministic(turn, history);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze this sales transcript turn and classify the buyer's intent.
Current customer turn: "${turn}"
Recent context: ${JSON.stringify(history.slice(-3))}

Respond ONLY with a valid JSON object strictly matching this TypeScript interface:
{
  "current_intent": string,
  "detected_intent": string,
  "confidence": number (0-100),
  "sentiment": "positive" | "neutral" | "negative" | "interested",
  "buying_signal": "low" | "medium" | "high",
  "urgency": "low" | "medium" | "high"
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
    if (parsed.detected_intent && parsed.sentiment) {
      return {
        current_intent: parsed.current_intent || parsed.detected_intent,
        detected_intent: parsed.detected_intent,
        confidence: Number(parsed.confidence) || 90,
        sentiment: parsed.sentiment,
        buying_signal: parsed.buying_signal || 'medium',
        urgency: parsed.urgency || 'medium',
      };
    }
  } catch (error) {
    // Graceful fallback without delay
  }

  return detectIntentDeterministic(turn, history);
}
