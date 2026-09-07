/**
 * Domain-Agnostic Commerce Models
 * Supports cars, laptops, phones, appliances, TVs, furniture, etc.
 */

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceDelta: number;
  attributes: Record<string, string>; // e.g. { color: "Space Gray", storage: "1TB", ram: "32GB" }
  inStock: boolean;
}

export interface ProductOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  discountFixed?: number;
  validUntil?: string;
  terms?: string;
}

export interface ProductFinancingOption {
  tenureMonths: number;
  monthlyInstallment: number;
  interestRate: number;
  downPayment: number;
  lenderName: string;
}

export interface UniversalProduct {
  id: string;
  category: 'cars' | 'laptops' | 'phones' | 'appliances' | 'tvs' | 'furniture' | string;
  brand: string;
  name: string;
  description: string;
  tagline?: string;
  price: number;
  currency: string; // e.g. "INR", "USD"
  priceFormatted: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  stockQuantity: number;
  features: string[];
  specifications: Record<string, string | number>;
  variants: ProductVariant[];
  images: string[];
  rating: number; // 0-5
  reviewCount?: number;
  warranty: string;
  financing?: ProductFinancingOption[];
  offers?: ProductOffer[];
  storeAvailability: Record<string, boolean>; // storeId -> available
  metadata: Record<string, any>;
  has3dModel?: boolean;
}

export interface StoreService {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export interface UniversalStore {
  id: string;
  name: string;
  type: 'Store' | 'Showroom' | 'Dealer' | 'Branch' | 'OnlineStore';
  category: string;
  location: {
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
    postalCode?: string;
  };
  inventory: Record<string, number>; // productId -> quantity
  services: StoreService[];
  offers: ProductOffer[];
  openingHours: string;
  contact: {
    phone: string;
    email: string;
    managerName?: string;
  };
  capabilities: string[]; // e.g. ["3D Demo", "Instant Delivery", "Financing On-Site", "Service Bay"]
}

export interface CartItem {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  unitPrice: number;
  quantity: number;
  selectedVariant?: ProductVariant;
  totalPrice: number;
}

export interface UniversalCart {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface UniversalQuote {
  id: string;
  customerId: string;
  customerName: string;
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  concessionsApplied: {
    name: string;
    amount: number;
    authorizedBy: string;
  }[];
  finalAmount: number;
  currency: string;
  validUntil: string;
  status: 'draft' | 'presented' | 'accepted' | 'expired';
  createdAt: string;
}

export interface UniversalOrder {
  id: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  storeId: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  fulfillmentType: 'pickup' | 'delivery' | 'concierge_setup';
  deliveryAddress?: string;
  status: 'pending_confirmation' | 'confirmed' | 'processing' | 'ready_for_pickup' | 'completed';
  confirmedAt?: string;
  createdAt: string;
}
