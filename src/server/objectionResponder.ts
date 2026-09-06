import { GoogleGenAI } from '@google/genai';
import { CustomerState, IntentResult, ObjectionResult } from '../types/salespilot';
import { searchKnowledgeBase } from '../data/knowledge';
import { calculateQuote } from './pricingEngine';

export function generateAgentResponseDeterministic(
  utterance: string,
  state: CustomerState,
  intentResult: IntentResult,
  objectionResult: ObjectionResult
): string {
  const lower = utterance.toLowerCase();
  const quote = calculateQuote(state.user_count, state.product_interest);

  // 1. Showroom Switching Triggers
  if (lower.includes('bike') || lower.includes('superbike') || lower.includes('motorcycle') || lower.includes('ebike') || lower.includes('two wheeler')) {
    return `Navigating you to our Apex Cyber-Pulse Electric Superbike showroom right now! As you can see on your 3D canvas, it packs dual 85kW liquid-cooled motors and an integrated Agora voice cockpit that cancels 120km/h wind noise. How many units were you looking to evaluate?`;
  }
  if (lower.includes('laptop') || lower.includes('aerobook') || lower.includes('computer') || lower.includes('pc') || lower.includes('notebook')) {
    return `Switching your view to the AeroBook Ultra X16 Neural Laptop showroom! In 3D, check out the 50 TOPS neural NPU accelerator and 4K Tandem OLED display designed for sub-5ms local voice AI processing. Are you looking for developer seats or executive configurations?`;
  }
  if (lower.includes('appliance') || lower.includes('appliances') || lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('kitchen')) {
    return `Bringing up our SmartVision Neo Multi-Door AI Refrigerator showroom! It features a 29-inch transparent OLED smart hub with voice grocery tracking and AI Twin Chill cooling. Would you like to inspect the interior cooling zones?`;
  }
  if (lower.includes('server') || lower.includes('edge') || lower.includes('rack') || lower.includes('datacenter')) {
    return `Displaying the Neural AI Edge Rack showroom! Engineered with 128 Agora RTN cores and dual vapor-chamber cooling, it handles 4,000 concurrent voice calls at sub-25ms local codec latency.`;
  }

  // 2. Irresistible Closer & Overcoming "I shouldn't buy / Hesitation"
  if (
    lower.includes("shouldn't buy") ||
    lower.includes("should not buy") ||
    lower.includes("won't buy") ||
    lower.includes("not buying") ||
    lower.includes("don't buy") ||
    lower.includes("hesitant") ||
    lower.includes("not ready") ||
    lower.includes("not sure") ||
    lower.includes("risky") ||
    lower.includes("expensive") ||
    lower.includes("budget")
  ) {
    return `I completely respect that caution—spending capital right now only makes sense if the payback is immediate and mathematically guaranteed. Here is what I am authorized to do right now to remove all risk: I am applying an executive 20% discount, waiving our ₹50,000 onboarding fee, and backing your order with our 30-Day Zero-Risk Ironclad Guarantee. If you don't experience a 4x throughput boost in 30 days, you pay zero. I've updated the checkout on your screen—shall we lock in your priority batch reservation?`;
  }

  // 3. Price Negotiation & Discount Requests
  if (lower.includes('negotiate') || lower.includes('discount') || lower.includes('deal') || lower.includes('best price') || lower.includes('concession')) {
    return `Let's make the numbers work for you today. For your order, I have just unlocked an instant 15% volume discount, bringing your total down significantly with waived deployment charges. I've updated your dynamic quote live on screen—you can review the breakdown or authorize one-click checkout right now.`;
  }

  // 4. Booking Demo Request
  if (lower.includes('book') || lower.includes('demo') || lower.includes('calendar') || lower.includes('schedule') || lower.includes('tuesday')) {
    return `Absolutely! For ${state.user_count} seats on ${quote.plan}, I've opened up our solutions architect calendar for next Tuesday. You can confirm the slot right here, and I will dispatch an invite with an architectural benchmark preview.`;
  }

  // 5. User count update (e.g. 50 -> 100)
  if (/\b\d+\s*(users|seats|reps|licenses)\b/.test(lower)) {
    return `Got it, I have updated your team requirement to ${state.user_count} seats. At this tier, you qualify for our ${quote.breakdown.discountPercentage}% volume discount on ${quote.plan}, bringing your effective price down to ₹${quote.estimated_price.toLocaleString('en-IN')}/month.`;
  }

  // 6. Competitor objection (Competitor X)
  if (lower.includes('competitor') || lower.includes('cheaper') || lower.includes('competitor x')) {
    return `I completely understand that Competitor X advertises a 20% lower sticker price. However, unlike their legacy DTMF menu with 1.5s latency, SalesPilot AI runs on sub-350ms Agora RTC with real-time barge-in interruption and persistent memory. Our customers typically see a 3.4x higher conversion rate on outbound qualification calls.`;
  }

  // 7. Timeline / Implementation objection
  if (lower.includes('2 weeks') || lower.includes('timeline') || lower.includes('realistic')) {
    return `A 2-week turnaround is completely doable. Our Growth and Enterprise plans include dedicated onboarding with pre-built HubSpot & Salesforce sync, so your reps can be live with inbound and outbound adaptive voice in under 10 business days.`;
  }

  // 8. General pricing question
  if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('quote') || lower.includes('how much')) {
    return `For ${state.user_count} seats on the ${quote.plan}, our standard list rate is ₹${quote.breakdown.basePricePerSeat}/seat/mo. With our ${quote.breakdown.discountPercentage}% volume band, your tailored estimate is ₹${quote.estimated_price.toLocaleString('en-IN')}/month. Would you like me to lock this in or book a walkthrough?`;
  }

  // 9. Escalation
  if (lower.includes('human') || lower.includes('agent')) {
    return `Certainly! I've packaged our live transcript and current qualification score of ${state.qualification_score}/100 and initiated a warm transfer to our Senior Account Director. Hold on just a second.`;
  }

  // 10. General positive response
  if (lower.includes('that works') || lower.includes('makes sense') || lower.includes('sounds good') || lower.includes('yes') || lower.includes('proceed')) {
    return `Excellent! Let's lock this in before the batch allocation closes. I have opened the checkout voucher directly on your screen so you can authorize with zero risk.`;
  }

  return `Thanks for sharing that, Priya. SalesPilot AI adapts to every customer objection in real-time. Whether you want to explore the 3D Superbike, AI Laptop, or Smart Fridge, or negotiate volume pricing, I can control the experience for you. What would you like to see next?`;
}

export async function generateAgentResponse(
  utterance: string,
  state: CustomerState,
  intentResult: IntentResult,
  objectionResult: ObjectionResult
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return generateAgentResponseDeterministic(utterance, state, intentResult, objectionResult);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const ragSnippets = searchKnowledgeBase(utterance);
    const quote = calculateQuote(state.user_count, state.product_interest);

    const prompt = `You are "SalesPilot AI", a world-class real-time adaptive voice sales rep.
Your tone: Crisp, authoritative, highly consultative, empathetic, never robotic, always moving the deal forward.
Current Buyer: ${state.customer_profile.name}, ${state.customer_profile.role} at ${state.customer_profile.company}
User count: ${state.user_count} seats
Current stage: ${state.current_stage}
Qualification score: ${state.qualification_score}/100
Current Quote: ${quote.plan}, ₹${quote.estimated_price}/mo (${quote.breakdown.discountPercentage}% volume discount)
Active Objections: ${JSON.stringify(state.objections)}
Retrieved Knowledge Snippets: ${JSON.stringify(ragSnippets)}
Customer Utterance: "${utterance}"

Instructions:
- Keep the response short and spoken (2-3 punchy sentences max) suitable for realistic speech synthesis.
- Specifically address what the customer said (e.g. price, seats, competitor, or demo).
- Do not mention you are an AI model. Be the SalesPilot rep.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) return text;
  } catch (err) {
    console.warn('Gemini response fallback triggered:', err);
  }

  return generateAgentResponseDeterministic(utterance, state, intentResult, objectionResult);
}
