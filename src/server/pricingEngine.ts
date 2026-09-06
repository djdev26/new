import { QuoteResult, QuoteBreakdown } from '../types/salespilot';
import { productsData, pricingRulesData } from '../data/knowledge';

export function calculateQuote(
  userCount: number,
  preferredPlan?: string,
  requirements?: string[]
): QuoteResult {
  const users = Math.max(1, userCount || 1);

  // Determine appropriate plan if not strictly specified
  let selectedPlanId = (preferredPlan || '').toLowerCase();
  if (!selectedPlanId || selectedPlanId === 'auto') {
    if (users <= 20) {
      selectedPlanId = 'starter';
    } else if (users <= 100) {
      selectedPlanId = 'growth';
    } else {
      selectedPlanId = 'enterprise';
    }
  }

  const product =
    productsData.find((p) => p.id === selectedPlanId) ||
    productsData.find((p) => p.id === 'growth')!;

  const basePricePerSeat = product.pricePerUser;
  const subtotal = users * basePricePerSeat;

  // Find volume band discount
  let discountPercentage = 0;
  for (const band of pricingRulesData.volumeBands) {
    if (users >= band.min && users <= band.max) {
      discountPercentage = band.discountPct;
      break;
    }
  }

  // If enterprise with 100+ seats, apply negotiated enterprise volume rate (30% discount)
  if (users >= 100 && product.id === 'enterprise') {
    discountPercentage = Math.max(discountPercentage, 30);
  }

  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const finalPricePerMonth = subtotal - discountAmount;
  const annualTotal = finalPricePerMonth * 12;

  const breakdown: QuoteBreakdown = {
    planName: product.name,
    basePricePerSeat,
    userCount: users,
    subtotal,
    discountPercentage,
    discountAmount,
    finalPricePerMonth,
    annualTotal,
    includedFeatures: product.features,
  };

  return {
    plan: product.name,
    users,
    estimated_price: finalPricePerMonth,
    breakdown,
  };
}
