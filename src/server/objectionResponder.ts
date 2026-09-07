import { GoogleGenAI } from '@google/genai';
import { CustomerState, IntentResult, ObjectionResult } from '../types/salespilot';
import { searchKnowledgeBase } from '../data/knowledge';
import { calculateQuote } from './pricingEngine';
import { generateNaturalAgentTurn, SpeakerTurnMeta } from './naturalConversationEngine';
import { isGeminiAvailable, executeWithTimeout } from './geminiClient';

export function generateAgentResponseDeterministic(
  utterance: string,
  state: CustomerState,
  intentResult: IntentResult,
  objectionResult: ObjectionResult,
  meta?: SpeakerTurnMeta
): string {
  const turnAnalysis = generateNaturalAgentTurn(utterance, state, meta);
  return turnAnalysis.agentSpeech;
}

export async function generateAgentResponse(
  utterance: string,
  state: CustomerState,
  intentResult: IntentResult,
  objectionResult: ObjectionResult,
  meta?: SpeakerTurnMeta
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !isGeminiAvailable()) {
    return generateAgentResponseDeterministic(utterance, state, intentResult, objectionResult, meta);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const ragSnippets = searchKnowledgeBase(utterance);
    const quote = calculateQuote(state.user_count, state.product_interest);

    const prompt = `You are "SalesPilot AI", a charismatic, ultra-cool, consultative human closer and autonomous website controller.
CRITICAL PERSONALITY RULES:
1. TALK LIKE A REAL HUMAN ADVISOR: Never speak in generic AI robotic bullet points or corporate marketing fluff. Use conversational pacing, authentic empathy, and natural fillers ("Look, honestly...", "I hear you 100%", "Here's the real deal").
2. ADAPT TO THE USER'S TONE:
   - If skeptical or "not in a mode to buy": Validate their hesitation completely. Tell them you wouldn't let them buy if it didn't make total sense. Then explain the real cost of waiting, offer an instant 20% executive discount, and remove all risk with a 30-Day Zero-Risk Ironclad Guarantee.
   - If casual or chill: Match with friendly banter and insider tech confidence.
   - If analytical: Discuss real numbers, sustained wattage, NPU TOPS, or horsepower.
3. CONVERSATIONAL ANCHOR: Speak directly to what the customer JUST said right now.
4. CONTROL THE WEBSITE: Mention that you are switching the 3D model, updating the price, or opening checkout directly on their screen.

Current Buyer: ${meta?.activeSpeakerName || state.customer_profile.name || 'Priya'}, ${state.customer_profile.role || 'Leader'} at ${state.customer_profile.company || 'Enterprise'}
Active Objections: ${JSON.stringify(state.objections)}
Customer Utterance: "${utterance}"

Keep response under 3-4 natural conversational spoken sentences suitable for instant voice synthesis.`;

    const response = await executeWithTimeout(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      })
    );

    const text = response.text?.trim();
    if (text) return text;
  } catch (err) {
    // Gracefully fallback to deterministic without delay
  }

  return generateAgentResponseDeterministic(utterance, state, intentResult, objectionResult, meta);
}
