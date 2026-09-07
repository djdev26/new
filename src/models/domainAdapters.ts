import { UniversalProduct } from './commerce';
import { CustomerDecisionPassport } from './passport';

export interface ComparisonResultItem {
  product: UniversalProduct;
  advantages: string[];
  disadvantages: string[];
  bestFor: string;
  verdictScore: number;
}

export interface DynamicComparisonResult {
  products: UniversalProduct[];
  items: ComparisonResultItem[];
  keyDifferences: {
    attribute: string;
    values: Record<string, string | number>;
    significance: string;
  }[];
  overallRecommendation: string;
  confidence: number;
  spokenSummary: string;
}

export interface DomainAdapter {
  category: string;
  displayName: string;
  getComparisonCriteria(): string[];
  formatSpecificationHighlight(product: UniversalProduct): string;
  calculateMatchScore(product: UniversalProduct, passport: Partial<CustomerDecisionPassport>): number;
  compare(products: UniversalProduct[], passport?: Partial<CustomerDecisionPassport>): DynamicComparisonResult;
  getSpecializedQuestions(): string[];
}

export class EVAdapter implements DomainAdapter {
  category = 'cars';
  displayName = 'Performance Cars & Luxury SUVs / EVs';

  getComparisonCriteria(): string[] {
    return ['0-100 km/h acceleration', 'Power & Torque', 'Drivetrain / PASM', 'Seating & Boot Space', 'Luxury Tech'];
  }

  formatSpecificationHighlight(product: UniversalProduct): string {
    const power = product.specifications['Power'] || product.specifications['Horsepower'] || 'N/A';
    const accel = product.specifications['0-100 km/h'] || 'N/A';
    return `${product.brand} ${product.name} delivers ${power}, reaching 0-100 km/h in ${accel}.`;
  }

  calculateMatchScore(product: UniversalProduct, passport: Partial<CustomerDecisionPassport> = {}): number {
    let score = 70;
    const budget = passport.budget?.max;
    if (budget && product.price <= budget) score += 15;
    if (budget && product.price > budget * 1.15) score -= 25;
    
    // Preferences
    const prefs = (passport.preferences || []).map((p) => p.toLowerCase());
    const lowerName = product.name.toLowerCase();
    const lowerDesc = product.description.toLowerCase();
    
    if (prefs.some((p) => p.includes('suv') || p.includes('family')) && (lowerName.includes('range rover') || lowerName.includes('x5') || lowerName.includes('gle'))) {
      score += 20;
    }
    if (prefs.some((p) => p.includes('speed') || p.includes('track') || p.includes('sport')) && lowerName.includes('porsche')) {
      score += 20;
    }
    return Math.min(100, Math.max(10, score));
  }

  compare(products: UniversalProduct[], passport?: Partial<CustomerDecisionPassport>): DynamicComparisonResult {
    if (products.length === 0) {
      return {
        products: [],
        items: [],
        keyDifferences: [],
        overallRecommendation: 'No vehicles selected for comparison.',
        confidence: 50,
        spokenSummary: 'Please select at least two vehicles to compare.',
      };
    }

    const items: ComparisonResultItem[] = products.map((p) => {
      const isPorsche = p.brand.toLowerCase().includes('porsche');
      const isSuv = p.name.toLowerCase().includes('range rover') || p.name.toLowerCase().includes('x5') || p.name.toLowerCase().includes('gle');
      
      const advantages: string[] = [];
      const disadvantages: string[] = [];
      let bestFor = 'General luxury transport';

      if (isPorsche) {
        advantages.push('Track-grade steering precision, lightning PDK transmission, iconic design pedigree');
        disadvantages.push('Tight 2+2 cockpit room, firm sport suspension over uneven surfaces');
        bestFor = 'Enthusiasts desiring peak handling, sports performance, and driver engagement';
      } else if (isSuv) {
        advantages.push('First-class executive cabin, generous legroom, commanding ground clearance');
        disadvantages.push('Larger footprint in city traffic, higher fuel/energy consumption');
        bestFor = 'Chauffeured executives, long touring, and comfortable family travel';
      } else {
        advantages.push('Well-rounded balance of utility, modern safety, and aggressive presence');
        disadvantages.push('Less brand prestige than flagship German or British tier');
        bestFor = 'Practical everyday commuting and rugged weekend adventures';
      }

      return {
        product: p,
        advantages,
        disadvantages,
        bestFor,
        verdictScore: this.calculateMatchScore(p, passport),
      };
    });

    items.sort((a, b) => b.verdictScore - a.verdictScore);
    const winner = items[0];

    return {
      products,
      items,
      keyDifferences: [
        {
          attribute: 'Performance & Drivetrain',
          values: Object.fromEntries(products.map((p) => [p.name, String(p.specifications['0-100 km/h'] || 'N/A')])),
          significance: 'Key metric determining acceleration and sport dynamics.',
        },
        {
          attribute: 'Price & Total Value',
          values: Object.fromEntries(products.map((p) => [p.name, p.priceFormatted])),
          significance: 'Capital investment comparison with warranty inclusions.',
        },
      ],
      overallRecommendation: `Based on your stated priorities, the ${winner.product.name} stands out as the optimal choice for ${winner.bestFor.toLowerCase()}.`,
      confidence: 88,
      spokenSummary: `Comparing both, ${winner.product.name} is the stronger recommendation if you want ${winner.bestFor.toLowerCase()}, whereas ${items[1]?.product.name || 'the alternative'} is geared differently.`,
    };
  }

  getSpecializedQuestions(): string[] {
    return [
      'Are you looking for an everyday daily driver or a track/weekend performance vehicle?',
      'Is rear seat comfort and executive luggage capacity a priority, or pure driver cockpit engagement?',
    ];
  }
}

export class LaptopAdapter implements DomainAdapter {
  category = 'laptops';
  displayName = 'Neural Laptops & Pro Workstations';

  getComparisonCriteria(): string[] {
    return ['CPU / NPU AI Tops', 'GPU Compute', 'Display Quality & Color Space', 'Battery Endurance', 'Thermal Cooling'];
  }

  formatSpecificationHighlight(product: UniversalProduct): string {
    const proc = product.specifications['Processor'] || 'High Performance Processor';
    const ram = product.specifications['Memory / RAM'] || product.specifications['RAM'] || '16GB';
    return `${product.brand} ${product.name} powered by ${proc} with ${ram}.`;
  }

  calculateMatchScore(product: UniversalProduct, passport: Partial<CustomerDecisionPassport> = {}): number {
    let score = 70;
    const lowerName = product.name.toLowerCase();
    const dislikes = (passport.dislikes || []).map((d) => d.toLowerCase());
    const needs = (passport.needs || []).map((n) => n.toLowerCase());

    // Dislikes heavy devices
    if (dislikes.some((d) => d.includes('heavy') || d.includes('weight'))) {
      if (lowerName.includes('thinkpad x1') || lowerName.includes('spectre') || lowerName.includes('zephyrus')) {
        score += 20;
      } else if (lowerName.includes('alienware') || lowerName.includes('predator') || lowerName.includes('razer')) {
        score -= 30; // Heavy gaming laptops penalized
      }
    }

    // Video editing / AI workloads
    if (needs.some((n) => n.includes('video') || n.includes('edit') || n.includes('ai') || n.includes('code'))) {
      if (lowerName.includes('macbook pro') || lowerName.includes('xps 16') || lowerName.includes('zephyrus')) {
        score += 25;
      }
    }

    // Battery life priority
    if (needs.some((n) => n.includes('battery') || n.includes('travel'))) {
      if (lowerName.includes('macbook') || lowerName.includes('surface')) {
        score += 20;
      }
    }

    return Math.min(100, Math.max(10, score));
  }

  compare(products: UniversalProduct[], passport?: Partial<CustomerDecisionPassport>): DynamicComparisonResult {
    const items: ComparisonResultItem[] = products.map((p) => {
      const lower = p.name.toLowerCase();
      const isApple = p.brand.toLowerCase().includes('apple');
      const isThinkpad = lower.includes('thinkpad');
      const isGaming = lower.includes('alienware') || lower.includes('predator') || lower.includes('razer');

      const advantages: string[] = [];
      const disadvantages: string[] = [];
      let bestFor = 'General professional development and computing';

      if (isApple) {
        advantages.push('Industry-leading 22-hour battery life, zero thermal throttling on battery, high unified memory bandwidth');
        disadvantages.push('Zero internal upgradeability, macOS-only software ecosystem');
        bestFor = 'Creative pros, ProRes video editing, and all-day unplugged executive workflow';
      } else if (isThinkpad) {
        advantages.push('Legendary carbon fiber chassis, ultra-light 1.09kg portability, best-in-class tactile keyboard');
        disadvantages.push('Integrated graphics unsuitable for heavy AAA 3D rendering');
        bestFor = 'Frequent flyers, business leaders, and intensive coding on the move';
      } else if (isGaming) {
        advantages.push('Maximum discrete RTX graphics wattage, Vapor Chamber cooling, upgradeable SODIMM RAM');
        disadvantages.push('Heavier chassis (>2.3kg), bulky power adapter, shorter battery runtime (3-4 hrs)');
        bestFor = 'Local LLM fine-tuning, 3D simulation, and hardcore gaming';
      } else {
        advantages.push('Stunning borderless OLED touch display, premium CNC machined aluminium aesthetic');
        disadvantages.push('Touch-bar capacitive keys require brief muscle memory adaptation');
        bestFor = 'Designers, modern executive presence, and balanced multitasking';
      }

      return {
        product: p,
        advantages,
        disadvantages,
        bestFor,
        verdictScore: this.calculateMatchScore(p, passport),
      };
    });

    items.sort((a, b) => b.verdictScore - a.verdictScore);
    const winner = items[0];

    return {
      products,
      items,
      keyDifferences: [
        {
          attribute: 'Battery & Efficiency',
          values: Object.fromEntries(products.map((p) => [p.name, String(p.specifications['Battery Life'] || 'N/A')])),
          significance: 'Runtime when disconnected from wall outlets during intensive work.',
        },
        {
          attribute: 'Weight & Chassis',
          values: Object.fromEntries(products.map((p) => [p.name, String(p.specifications['Weight'] || 'N/A')])),
          significance: 'Critical for commute and travel ergonomics.',
        },
      ],
      overallRecommendation: `For your workflow, the ${winner.product.name} is the standout selection because it prioritizes ${winner.bestFor.toLowerCase()}.`,
      confidence: 91,
      spokenSummary: `Comparing the two: ${winner.product.name} gives you the edge for ${winner.bestFor.toLowerCase()}, whereas ${items[1]?.product.name || 'the other option'} trades that off.`,
    };
  }

  getSpecializedQuestions(): string[] {
    return [
      'Do you primarily work plugged in at a desk or travel frequently where all-day battery life is non-negotiable?',
      'Are you running heavy GPU/AI workloads, or is silent operation and a lightweight chassis your main priority?',
    ];
  }
}

export class ApplianceAdapter implements DomainAdapter {
  category = 'appliances';
  displayName = 'Connected Living & Smart Home Appliances';

  getComparisonCriteria(): string[] {
    return ['Energy Efficiency (Star / ISEER)', 'Capacity & Footprint', 'AI / IoT Connectivity', 'Noise Level (dB)', 'Warranty & Inverter Motor'];
  }

  formatSpecificationHighlight(product: UniversalProduct): string {
    const cap = product.specifications['Capacity'] || product.specifications['Volume'] || 'High Capacity';
    const energy = product.specifications['Energy Rating'] || '5 Star';
    return `${product.brand} ${product.name} with ${cap} and ${energy} energy saving rating.`;
  }

  calculateMatchScore(product: UniversalProduct, passport: Partial<CustomerDecisionPassport> = {}): number {
    let score = 70;
    const budget = passport.budget?.max;
    if (budget && product.price <= budget) score += 15;
    return Math.min(100, Math.max(10, score));
  }

  compare(products: UniversalProduct[], passport?: Partial<CustomerDecisionPassport>): DynamicComparisonResult {
    const items: ComparisonResultItem[] = products.map((p) => {
      const advantages = ['Low energy consumption with dual inverter inverter technology', 'Smart diagnostics over Wi-Fi'];
      const disadvantages = ['Requires dedicated space and plumbing/electrical hookup'];
      return {
        product: p,
        advantages,
        disadvantages,
        bestFor: 'Modern smart home living',
        verdictScore: this.calculateMatchScore(p, passport),
      };
    });

    items.sort((a, b) => b.verdictScore - a.verdictScore);
    const winner = items[0];

    return {
      products,
      items,
      keyDifferences: [
        {
          attribute: 'Energy & Efficiency',
          values: Object.fromEntries(products.map((p) => [p.name, String(p.specifications['Energy Rating'] || '5-Star')])),
          significance: 'Directly impacts monthly electricity expenses.',
        },
      ],
      overallRecommendation: `The ${winner.product.name} provides superior total cost of ownership through lower power draw and extended warranty.`,
      confidence: 85,
      spokenSummary: `Comparing these appliances, ${winner.product.name} delivers better energy efficiency and quieter operation for your home.`,
    };
  }

  getSpecializedQuestions(): string[] {
    return [
      'What are the kitchen/room space dimensions you are fitting this into?',
      'How important are smart Wi-Fi controls and remote monitoring from your phone?',
    ];
  }
}

export class PhoneAdapter implements DomainAdapter {
  category = 'phones';
  displayName = 'Flagship Smartphones & Mobile Tech';

  getComparisonCriteria(): string[] {
    return ['Camera Optical Zoom & Sensor', 'Chipset / Benchmark', 'Display Brightness & Refresh Rate', 'Battery & Fast Charging', 'Software Longevity & AI'];
  }

  formatSpecificationHighlight(product: UniversalProduct): string {
    const chip = product.specifications['Processor'] || 'Flagship SoC';
    const cam = product.specifications['Camera'] || 'Pro Camera Array';
    return `${product.brand} ${product.name} equipped with ${chip} and ${cam}.`;
  }

  calculateMatchScore(product: UniversalProduct, passport: Partial<CustomerDecisionPassport> = {}): number {
    let score = 70;
    const budget = passport.budget?.max;
    if (budget && product.price <= budget) score += 15;
    if (budget && product.price > budget * 1.1) score -= 20;

    const prefs = (passport.preferences || []).map((p) => p.toLowerCase());
    const lowerName = product.name.toLowerCase();

    if (prefs.some((p) => p.includes('apple') || p.includes('ios')) && lowerName.includes('iphone')) {
      score += 25;
    }
    if (prefs.some((p) => p.includes('camera') || p.includes('photo')) && (lowerName.includes('pixel') || lowerName.includes('s24 ultra') || lowerName.includes('iphone'))) {
      score += 20;
    }
    return Math.min(100, Math.max(10, score));
  }

  compare(products: UniversalProduct[], passport?: Partial<CustomerDecisionPassport>): DynamicComparisonResult {
    const items: ComparisonResultItem[] = products.map((p) => {
      const lower = p.name.toLowerCase();
      const isApple = p.brand.toLowerCase().includes('apple');
      const isSamsung = lower.includes('galaxy') || lower.includes('s24');
      const isPixel = lower.includes('pixel');

      const advantages: string[] = [];
      const disadvantages: string[] = [];
      let bestFor = 'Everyday mobile productivity and photography';

      if (isApple) {
        advantages.push('Industry-leading ProRes 4K/120 video recording, Grade 5 Titanium chassis, seamless ecosystem integration');
        disadvantages.push('Slower 25W charging compared to Android rivals, strict iOS sideloading limits');
        bestFor = 'Content creators, video vloggers, and users invested in Mac/iPad ecosystem';
      } else if (isSamsung) {
        advantages.push('Embedded S-Pen stylus, 5x/10x periscope optical zoom, anti-reflective Gorilla Armor glass');
        disadvantages.push('Larger, boxier ergonomic profile in one-handed pocket use');
        bestFor = 'Power users, multitasking with multi-window, and telephoto photography';
      } else if (isPixel) {
        advantages.push('Industry-benchmark computational photography, zero-bloat Clean Android, 7 years guaranteed OS updates');
        disadvantages.push('Tensor G4 raw peak gaming benchmarks trail Snapdragon 8 Gen 3');
        bestFor = 'Pure Android purists, point-and-shoot camera accuracy, and day-one AI features';
      } else {
        advantages.push('Incredible price-to-performance ratio with 100W ultra-fast charging in under 26 minutes');
        disadvantages.push('IP65 water resistance rather than full IP68 submersible');
        bestFor = 'Buyers demanding max performance and fast charging without paying flagship premiums';
      }

      return {
        product: p,
        advantages,
        disadvantages,
        bestFor,
        verdictScore: this.calculateMatchScore(p, passport),
      };
    });

    items.sort((a, b) => b.verdictScore - a.verdictScore);
    const winner = items[0];

    return {
      products,
      items,
      keyDifferences: [
        {
          attribute: 'Camera & Optics',
          values: Object.fromEntries(products.map((p) => [p.name, String(p.specifications['Camera'] || 'Pro Array')])),
          significance: 'Sensor size, zoom capabilities, and video codecs.',
        },
        {
          attribute: 'Battery & Charging Speed',
          values: Object.fromEntries(products.map((p) => [p.name, String(p.specifications['Charging'] || 'Fast Charge')])),
          significance: '0 to 100% recharge duration.',
        },
      ],
      overallRecommendation: `For your use case, the ${winner.product.name} is the superior choice because of ${winner.bestFor.toLowerCase()}.`,
      confidence: 90,
      spokenSummary: `Comparing the phones: ${winner.product.name} wins out for ${winner.bestFor.toLowerCase()}, while ${items[1]?.product.name || 'the other phone'} offers different trade-offs.`,
    };
  }

  getSpecializedQuestions(): string[] {
    return [
      'Do you prioritize camera video quality, battery charging speed, or software longevity?',
      'Are you already using Apple products or do you prefer Android customization and S-Pen?',
    ];
  }
}

// Adapter Registry
const adapters: Record<string, DomainAdapter> = {
  cars: new EVAdapter(),
  laptops: new LaptopAdapter(),
  appliances: new ApplianceAdapter(),
  phones: new PhoneAdapter(),
};

export function getDomainAdapter(category: string): DomainAdapter {
  const norm = category.toLowerCase().trim();
  if (norm.includes('car') || norm.includes('vehicle') || norm.includes('auto') || norm.includes('ev')) {
    return adapters.cars;
  }
  if (norm.includes('laptop') || norm.includes('mac') || norm.includes('pc') || norm.includes('computer')) {
    return adapters.laptops;
  }
  if (norm.includes('appliance') || norm.includes('fridge') || norm.includes('ac') || norm.includes('washer')) {
    return adapters.appliances;
  }
  if (norm.includes('phone') || norm.includes('mobile') || norm.includes('smart') || norm.includes('pixel') || norm.includes('galaxy') || norm.includes('iphone')) {
    return adapters.phones;
  }
  // Default fallback to laptops adapter
  return adapters.laptops;
}
