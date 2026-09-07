import { UniversalStore } from '../../models/commerce';

export class StoreService {
  private stores: Map<string, UniversalStore> = new Map();

  constructor() {
    this.initStores();
  }

  private initStores(): void {
    const defaultStores: UniversalStore[] = [
      {
        id: 'store-mumbai',
        name: 'SalesPilot Flagship Experience Center — Mumbai',
        type: 'Showroom',
        category: 'Omnichannel Superstore',
        location: {
          city: 'Mumbai',
          address: 'Bandra-Kurla Complex (BKC), G Block, Mumbai 400051',
          postalCode: '400051',
        },
        inventory: {},
        services: [
          { id: 'srv-demo', name: 'Private 3D Showroom Walkthrough' },
          { id: 'srv-consult', name: 'Dedicated Tech Concierge Consultation' },
          { id: 'srv-finance', name: 'Instant EMI & Enterprise Lease Financing' },
        ],
        offers: [
          {
            id: 'off-mumbai-launch',
            title: 'Mumbai Flagship Privilege',
            description: 'Complimentary priority white-glove delivery and setup across MMR.',
            discountPercentage: 5,
          },
        ],
        openingHours: '10:00 AM - 9:30 PM (7 Days a week)',
        contact: {
          phone: '+91 22 6123 4567',
          email: 'mumbai.flagship@salespilot.ai',
          managerName: 'Vikram Malhotra',
        },
        capabilities: ['3D Visualizer', 'Test Drive Bay', 'Enterprise Lab', 'Instant Pickup'],
      },
      {
        id: 'store-bangalore',
        name: 'SalesPilot Tech & Innovation Hub — Bangalore',
        type: 'Branch',
        category: 'AI & Neural Hardware Hub',
        location: {
          city: 'Bangalore',
          address: 'Indiranagar 100 Feet Road, HAL 2nd Stage, Bengaluru 560038',
          postalCode: '560038',
        },
        inventory: {},
        services: [
          { id: 'srv-benchmark', name: 'On-site Hardware Performance Benchmarking' },
          { id: 'srv-corp', name: 'B2B Procurement Desk' },
        ],
        offers: [
          {
            id: 'off-blr-dev',
            title: 'Developer Cloud Credit Bundle',
            description: 'Included 10,000 GPU compute credits with AI Workstation purchases.',
          },
        ],
        openingHours: '9:30 AM - 9:00 PM (Monday - Saturday)',
        contact: {
          phone: '+91 80 4987 6543',
          email: 'bangalore.hub@salespilot.ai',
          managerName: 'Deepa Krishnan',
        },
        capabilities: ['Developer Testing Pods', 'Same-Hour Express Dispatch'],
      },
      {
        id: 'store-delhi',
        name: 'SalesPilot Luxury Motors & Electronics — Delhi NCR',
        type: 'Dealer',
        category: 'Supercars & Smart Appliances',
        location: {
          city: 'Delhi NCR',
          address: 'Golf Course Road, Sector 54, Gurugram 122002',
          postalCode: '122002',
        },
        inventory: {},
        services: [
          { id: 'srv-track', name: 'Track Day Experience Booking' },
          { id: 'srv-home', name: 'Home Automation Architectural Survey' },
        ],
        offers: [
          {
            id: 'off-delhi-vip',
            title: 'Executive Fleet Tier',
            description: 'Extended 3-Year comprehensive maintenance on multi-unit acquisitions.',
          },
        ],
        openingHours: '10:30 AM - 8:30 PM',
        contact: {
          phone: '+91 124 456 7890',
          email: 'delhi.luxury@salespilot.ai',
          managerName: 'Karan Mehra',
        },
        capabilities: ['VIP Lounge', 'Indoor Dyno Bay', 'Appliance Gallery'],
      },
      {
        id: 'store-chennai',
        name: 'SalesPilot Coastal Electronics & Mobility — Chennai',
        type: 'Store',
        category: 'Hardware & EV Mobility',
        location: {
          city: 'Chennai',
          address: 'Anna Salai, Mount Road, Teynampet, Chennai 600018',
          postalCode: '600018',
        },
        inventory: {},
        services: [
          { id: 'srv-fast', name: 'Express Click & Collect' },
          { id: 'srv-exchange', name: 'Instant Old Hardware Exchange Valuation' },
        ],
        offers: [
          {
            id: 'off-chennai-festive',
            title: 'Southern Regional Concession',
            description: 'Free accessories bundle worth up to ₹15,000 on flagship laptops & phones.',
          },
        ],
        openingHours: '10:00 AM - 9:00 PM',
        contact: {
          phone: '+91 44 2434 8900',
          email: 'chennai.store@salespilot.ai',
          managerName: 'Suresh Raman',
        },
        capabilities: ['Fast Charging Bay', 'Exchange Valuation Desk'],
      },
      {
        id: 'store-online',
        name: 'SalesPilot Global Online Warehouse & Fulfillment',
        type: 'OnlineStore',
        category: 'Central Depot',
        location: {
          city: 'National Fulfillment Hub',
          address: 'Bhiwandi Logistics Park, Maharashtra',
        },
        inventory: {},
        services: [
          { id: 'srv-air', name: 'Air Express 24-Hour Delivery' },
          { id: 'srv-remote', name: 'Virtual Remote Showroom Assistance' },
        ],
        offers: [
          {
            id: 'off-online-all',
            title: 'Zero Delivery Fee Nationwide',
            description: 'Free expedited courier with live tracking on all orders.',
          },
        ],
        openingHours: '24/7 Digital Operations',
        contact: {
          phone: '1800-SALES-PILOT',
          email: 'support@salespilot.ai',
        },
        capabilities: ['Full Catalog Stock', 'Direct Factory Dispatch'],
      },
    ];

    defaultStores.forEach((s) => this.stores.set(s.id, s));
  }

  public getAllStores(): UniversalStore[] {
    return Array.from(this.stores.values());
  }

  public getStoreById(id: string): UniversalStore | undefined {
    return this.stores.get(id);
  }

  public searchStores(cityOrQuery: string): UniversalStore[] {
    const q = cityOrQuery.toLowerCase().trim();
    if (!q) return this.getAllStores();
    return Array.from(this.stores.values()).filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.location.city.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
    );
  }
}

export const storeService = new StoreService();
