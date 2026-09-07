import { UniversalProduct } from '../../models/commerce';
import { CustomerDecisionPassport } from '../../models/passport';
import { getDomainAdapter, DynamicComparisonResult } from '../../models/domainAdapters';
import { getAllProducts as getShowroomProducts } from '../../data/showrooms';

export class ProductService {
  private products: Map<string, UniversalProduct> = new Map();

  constructor() {
    this.loadCatalog();
  }

  private loadCatalog(): void {
    const rawProducts = getShowroomProducts();
    for (const raw of rawProducts) {
      const specsObj: Record<string, string | number> = {};
      (raw.specs || []).forEach((s) => {
        specsObj[s.label] = s.value;
      });

      const universal: UniversalProduct = {
        id: raw.id,
        category: raw.showroomId,
        brand: raw.brand,
        name: raw.name,
        description: raw.description,
        tagline: raw.tagline,
        price: raw.price,
        currency: 'INR',
        priceFormatted: raw.priceFormatted,
        availability: 'in_stock',
        stockQuantity: 15,
        features: (raw.specs || []).map((s) => `${s.label}: ${s.value}`),
        specifications: specsObj,
        variants: (raw.colors || []).map((c, i) => ({
          id: `var-${raw.id}-${i}`,
          name: c.name,
          sku: `${raw.id.toUpperCase()}-${c.name.replace(/\s+/g, '-').toUpperCase()}`,
          priceDelta: 0,
          attributes: { color: c.name },
          inStock: true,
        })),
        images: [],
        rating: raw.rating || 4.8,
        warranty: raw.warranty || '1 Year Standard Warranty',
        storeAvailability: {
          'store-mumbai': true,
          'store-bangalore': true,
          'store-delhi': true,
          'store-chennai': true,
          'store-online': true,
        },
        metadata: {
          metrics: raw.metrics,
          hotspots: raw.hotspots,
          has3dModel: raw.has3dModel,
        },
        has3dModel: raw.has3dModel,
      };

      this.products.set(universal.id, universal);
    }
  }

  public getAll(): UniversalProduct[] {
    return Array.from(this.products.values());
  }

  public getById(id: string): UniversalProduct | undefined {
    return this.products.get(id);
  }

  public search(query: string, category?: string, maxPrice?: number): UniversalProduct[] {
    const q = query.toLowerCase().trim();
    return Array.from(this.products.values()).filter((p) => {
      if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (maxPrice && p.price > maxPrice) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q))
      );
    });
  }

  public compare(productIds: string[], passport?: Partial<CustomerDecisionPassport>): DynamicComparisonResult {
    const matchedProducts = productIds
      .map((id) => this.getById(id))
      .filter((p): p is UniversalProduct => p !== undefined);

    if (matchedProducts.length === 0) {
      return {
        products: [],
        items: [],
        keyDifferences: [],
        overallRecommendation: 'No valid products specified for comparison.',
        confidence: 40,
        spokenSummary: 'I could not find the products you wanted to compare.',
      };
    }

    const primaryCategory = matchedProducts[0].category;
    const adapter = getDomainAdapter(primaryCategory);
    return adapter.compare(matchedProducts, passport);
  }

  public recommend(
    passport: Partial<CustomerDecisionPassport> = {},
    category?: string,
    limit: number = 3
  ): { products: UniversalProduct[]; rationale: string[] } {
    const targetCategory = category || passport.currentCategory || 'laptops';
    const adapter = getDomainAdapter(targetCategory);

    let candidates = Array.from(this.products.values()).filter(
      (p) => p.category.toLowerCase() === targetCategory.toLowerCase()
    );

    if (candidates.length === 0) {
      candidates = Array.from(this.products.values());
    }

    // Rank by domain adapter match score
    const scored = candidates.map((p) => ({
      product: p,
      score: adapter.calculateMatchScore(p, passport),
    }));

    scored.sort((a, b) => b.score - a.score);
    const topScored = scored.slice(0, limit);

    const rationale = topScored.map(
      (s) => `${s.product.name} (Match: ${s.score}%): fits budget and stated priorities.`
    );

    return {
      products: topScored.map((s) => s.product),
      rationale,
    };
  }

  public checkInventory(productId: string, storeId: string = 'store-mumbai'): {
    inStock: boolean;
    quantity: number;
    storeId: string;
    deliveryEstimate: string;
  } {
    const product = this.getById(productId);
    if (!product) {
      return { inStock: false, quantity: 0, storeId, deliveryEstimate: 'Item not found' };
    }
    const isAvail = product.storeAvailability[storeId] ?? true;
    return {
      inStock: isAvail,
      quantity: isAvail ? product.stockQuantity : 0,
      storeId,
      deliveryEstimate: isAvail ? 'Same day delivery / immediate in-store pickup available' : '2-3 business days',
    };
  }
}

export const productService = new ProductService();
