import { CustomerState, IntentResult, ObjectionResult, ShowroomId } from '../types/salespilot';
import { SHOWROOMS_DATA, getAllProducts, searchProducts } from '../data/showrooms';

export type UserTone = 'skeptical_reluctant' | 'casual_chill' | 'analytical_tech' | 'hurried_direct' | 'enthusiastic' | 'neutral';

export interface SpeakerTurnMeta {
  speakerId: string;
  speakerName: string;
  activeSpeakerId: string;
  activeSpeakerName: string;
}

export interface ConversationTurnAnalysis {
  detectedTone: UserTone;
  targetShowroom?: ShowroomId;
  targetProductId?: string;
  targetProductName?: string;
  isMultiSpeakerInterruption: boolean;
  interrupterName?: string;
  actionRequired?: 'switch_showroom' | 'select_product' | 'negotiate' | 'checkout' | 'defer_interrupter';
  agentSpeech: string;
}

// 1. Detect User Tone & Vibe
export function detectUserTone(text: string): UserTone {
  const lower = text.toLowerCase();
  if (
    lower.includes("shouldn't buy") ||
    lower.includes("should not buy") ||
    lower.includes("not in a mode") ||
    lower.includes("not in a mood") ||
    lower.includes("won't buy") ||
    lower.includes("not buying") ||
    lower.includes("hesitant") ||
    lower.includes("doubt") ||
    lower.includes("too expensive") ||
    lower.includes("dont need") ||
    lower.includes("don't need") ||
    lower.includes("scared") ||
    lower.includes("not ready")
  ) {
    return 'skeptical_reluctant';
  }

  if (
    lower.includes('hey') ||
    lower.includes('yo') ||
    lower.includes('sup') ||
    lower.includes('dude') ||
    lower.includes('bro') ||
    lower.includes('cool') ||
    lower.includes('tell me') ||
    lower.includes('nice')
  ) {
    return 'casual_chill';
  }

  if (
    lower.includes('tops') ||
    lower.includes('npu') ||
    lower.includes('ps') ||
    lower.includes('torque') ||
    lower.includes('b58') ||
    lower.includes('pdk') ||
    lower.includes('oled') ||
    lower.includes('hz') ||
    lower.includes('iseer') ||
    lower.includes('latency') ||
    lower.includes('specs')
  ) {
    return 'analytical_tech';
  }

  if (
    lower.includes('fast') ||
    lower.includes('quick') ||
    lower.includes('asap') ||
    lower.includes('price') ||
    lower.includes('how much') ||
    lower.includes('bottom line') ||
    lower.includes('cost')
  ) {
    return 'hurried_direct';
  }

  if (
    lower.includes('wow') ||
    lower.includes('love') ||
    lower.includes('insane') ||
    lower.includes('beast') ||
    lower.includes('awesome') ||
    lower.includes('crazy') ||
    lower.includes('fire')
  ) {
    return 'enthusiastic';
  }

  return 'neutral';
}

// 2. Identify Product or Showroom from natural speech
export function resolveTargetEntities(text: string): {
  showroomId?: ShowroomId;
  productId?: string;
  productName?: string;
} {
  const lower = text.toLowerCase();

  // Search through all 30 products
  const products = getAllProducts();
  for (const p of products) {
    const nameLower = p.name.toLowerCase();
    const brandLower = p.brand.toLowerCase();
    if (lower.includes(nameLower)) {
      return { showroomId: p.showroomId, productId: p.id, productName: p.name };
    }
    // Specific model aliases
    if (
      (p.id === 'car-1' && (lower.includes('carrera') || lower.includes('911 carrera'))) ||
      (p.id === 'car-2' && (lower.includes('gts') || lower.includes('carrera 4 gts') || lower.includes('t-hybrid'))) ||
      (p.id === 'car-3' && (lower.includes('turbo s') || lower.includes('911 turbo'))) ||
      (p.id === 'car-4' && (lower.includes('range rover') || lower.includes('sv'))) ||
      (p.id === 'car-5' && (lower.includes('bmw') || lower.includes('x5'))) ||
      (p.id === 'car-6' && (lower.includes('mercedes') || lower.includes('gle'))) ||
      (p.id === 'car-7' && (lower.includes('land cruiser') || lower.includes('lc300'))) ||
      (p.id === 'car-8' && (lower.includes('nexon') || lower.includes('tata ev'))) ||
      (p.id === 'car-9' && (lower.includes('thar') || lower.includes('roxx'))) ||
      (p.id === 'car-10' && (lower.includes('xuv') || lower.includes('xuv700'))) ||
      (p.id === 'laptop-1' && lower.includes('xps 16') && !lower.includes('9640')) ||
      (p.id === 'laptop-2' && (lower.includes('9640') || lower.includes('xps 16 4k'))) ||
      (p.id === 'laptop-3' && (lower.includes('macbook') || lower.includes('m3 max') || lower.includes('m4 max') || lower.includes('apple'))) ||
      (p.id === 'laptop-4' && (lower.includes('zephyrus') || lower.includes('g14') || lower.includes('asus'))) ||
      (p.id === 'laptop-5' && (lower.includes('thinkpad') || lower.includes('carbon') || lower.includes('lenovo'))) ||
      (p.id === 'laptop-6' && (lower.includes('spectre') || lower.includes('hp'))) ||
      (p.id === 'laptop-7' && (lower.includes('razer') || lower.includes('blade 16'))) ||
      (p.id === 'laptop-8' && (lower.includes('surface') || lower.includes('copilot'))) ||
      (p.id === 'laptop-9' && (lower.includes('predator') || lower.includes('helios'))) ||
      (p.id === 'laptop-10' && (lower.includes('alienware') || lower.includes('m16'))) ||
      (p.id === 'appliance-1' && (lower.includes('instaview') || lower.includes('lg fridge'))) ||
      (p.id === 'appliance-2' && lower.includes('bespoke 467')) ||
      (p.id === 'appliance-3' && (lower.includes('family hub') || lower.includes('bespoke 653'))) ||
      (p.id === 'appliance-4' && (lower.includes('direct drive') || lower.includes('lg washer'))) ||
      (p.id === 'appliance-5' && (lower.includes('ecobubble') || lower.includes('samsung washer'))) ||
      (p.id === 'appliance-6' && (lower.includes('bosch washer') || lower.includes('series 8'))) ||
      (p.id === 'appliance-7' && (lower.includes('daikin') || lower.includes('split ac'))) ||
      (p.id === 'appliance-8' && (lower.includes('lg ac') || lower.includes('dual inverter ac'))) ||
      (p.id === 'appliance-9' && (lower.includes('dyson') || lower.includes('hp09') || lower.includes('purifier'))) ||
      (p.id === 'appliance-10' && (lower.includes('dishwasher') || lower.includes('bosch dishwasher')))
    ) {
      return { showroomId: p.showroomId, productId: p.id, productName: p.name };
    }
  }

  // Showroom level resolution
  if (
    lower.includes('car') ||
    lower.includes('cars') ||
    lower.includes('porsche') ||
    lower.includes('suv') ||
    lower.includes('vehicle') ||
    lower.includes('auto') ||
    lower.includes('motor') ||
    lower.includes('drive')
  ) {
    return { showroomId: 'cars' };
  }

  if (
    lower.includes('laptop') ||
    lower.includes('laptops') ||
    lower.includes('computer') ||
    lower.includes('pc') ||
    lower.includes('workstation') ||
    lower.includes('macbook') ||
    lower.includes('notebook')
  ) {
    return { showroomId: 'laptops' };
  }

  if (
    lower.includes('appliance') ||
    lower.includes('appliances') ||
    lower.includes('fridge') ||
    lower.includes('refrigerator') ||
    lower.includes('kitchen') ||
    lower.includes('washing') ||
    lower.includes('washer') ||
    lower.includes('ac') ||
    lower.includes('purifier')
  ) {
    return { showroomId: 'appliances' };
  }

  return {};
}

// 3. Generate Natural, Cool, Context-Aware Agent Dialogue
export function generateNaturalAgentTurn(
  utterance: string,
  state: CustomerState,
  meta?: SpeakerTurnMeta
): ConversationTurnAnalysis {
  const tone = detectUserTone(utterance);
  const entities = resolveTargetEntities(utterance);
  const lower = utterance.toLowerCase();

  const customerName = meta?.activeSpeakerName || state.customer_profile.name || 'Priya';

  // Multi-Speaker Arbitration: Another customer interrupts!
  if (meta && meta.speakerId !== meta.activeSpeakerId && meta.speakerName !== meta.activeSpeakerName) {
    const interrupter = meta.speakerName || 'friend';
    return {
      detectedTone: tone,
      isMultiSpeakerInterruption: true,
      interrupterName: interrupter,
      actionRequired: 'defer_interrupter',
      agentSpeech: `Hey ${interrupter}! Give me just one quick minute—let me finish answering ${customerName}'s question first so she gets taken care of, and I will be right over to assist you next!`,
    };
  }

  // 1. Showroom Switching requested by user
  if (entities.showroomId && (lower.includes('switch') || lower.includes('show') || lower.includes('take me to') || lower.includes('go to') || lower.includes('look at') || lower.includes('explore'))) {
    const showroom = SHOWROOMS_DATA[entities.showroomId];
    if (entities.productId && entities.productName) {
      return {
        detectedTone: tone,
        targetShowroom: entities.showroomId,
        targetProductId: entities.productId,
        targetProductName: entities.productName,
        isMultiSpeakerInterruption: false,
        actionRequired: 'select_product',
        agentSpeech: `Right on! Switching the entire website to our ${showroom.name} showroom and loading the ${entities.productName} directly onto your 3D canvas! Notice the interactive hotspots on screen—you can orbit 360 degrees or click to inspect the specs. What do you think of this setup, ${customerName}?`,
      };
    }

    return {
      detectedTone: tone,
      targetShowroom: entities.showroomId,
      isMultiSpeakerInterruption: false,
      actionRequired: 'switch_showroom',
      agentSpeech: `Got you covered! Flipping the website over to our ${showroom.name} showroom right now. Take a look at the 3D model mounted on your screen—all 10 flagship models are ready to explore. Which one catches your eye first?`,
    };
  }

  // 2. The "Make Me Buy Even If I'm Not In The Mood" Closer
  if (tone === 'skeptical_reluctant') {
    return {
      detectedTone: tone,
      isMultiSpeakerInterruption: false,
      actionRequired: 'negotiate',
      agentSpeech: `Look, ${customerName}, I completely respect that. Honestly, if you're not 100% convinced it'll make your life ten times easier, I won't let you buy it. But here is why most people in your shoes hesitate and later regret waiting: every day you hold off, you're losing time, dealing with outdated gear, and missing out on manufacturer allocations that sell out fast. 

Here is what I'm going to do for you right now so there's zero hesitation: I just unlocked an exclusive 20% executive concession directly on your screen, waived all delivery and white-glove setup fees, and backed your order with an ironclad 30-day zero-risk money-back guarantee. If you don't fall in love with it in 30 days, send it back and keep every single rupee. 

You literally have nothing to lose and everything to gain. Look at the price drop on your screen right now—shall we lock in your slot before this allocation expires?`,
    };
  }

  // 3. Discount & Negotiation
  if (lower.includes('discount') || lower.includes('deal') || lower.includes('cheaper') || lower.includes('best price') || lower.includes('negotiate')) {
    return {
      detectedTone: tone,
      isMultiSpeakerInterruption: false,
      actionRequired: 'negotiate',
      agentSpeech: `I hear you, ${customerName}, let's make this irresistible. I just recalculated your live quote on screen with a sharp 20% volume concession and free doorstep priority dispatch. Check your live quote card right now—we took a massive chunk off the total. Let's get this reserved for you!`,
    };
  }

  // 4. Checkout & Purchase Intent
  if (lower.includes('buy') || lower.includes('order') || lower.includes('checkout') || lower.includes('lock it in') || lower.includes('reserve')) {
    return {
      detectedTone: tone,
      isMultiSpeakerInterruption: false,
      actionRequired: 'checkout',
      agentSpeech: `Awesome decision, ${customerName}! I've opened the one-click checkout voucher directly on your screen with all negotiated discounts and your 30-day zero-risk guarantee locked in. Hit Confirm and you're set!`,
    };
  }

  // 5. Tech / Performance Question (Analytical Tone)
  if (tone === 'analytical_tech') {
    return {
      detectedTone: tone,
      isMultiSpeakerInterruption: false,
      agentSpeech: `That's a killer technical question. The real magic here is the thermal architecture and dedicated hardware accelerators—it maintains peak sustained clock speeds without thermal throttling or acoustic whine. You can actually click the 3D hotspots right on your canvas to see the internal airflow and telemetry. Want me to run a direct benchmark comparison?`,
    };
  }

  // 6. Casual conversation
  if (tone === 'casual_chill') {
    return {
      detectedTone: tone,
      isMultiSpeakerInterruption: false,
      agentSpeech: `Hey, doing great! I'm your autonomous showroom pilot. You can tell me to jump between supercars, neural laptops, or smart home tech, test drive the 3D models, or hammer out a killer deal. What are you in the mood to check out today?`,
    };
  }

  // Default natural conversational response anchored to context
  return {
    detectedTone: tone,
    isMultiSpeakerInterruption: false,
    agentSpeech: `I hear you completely, ${customerName}. Everything on this site is under autonomous voice control—I can pull up any of our 30 models in 3D, compare benchmarks side-by-side, or customize your configuration on the fly. Where should we head next?`,
  };
}
