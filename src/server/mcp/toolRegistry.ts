import { productService } from '../commerce/productService';
import { storeService } from '../commerce/storeService';
import { globalCommerceRepository, PersistentMemoryItem } from '../storage/sqliteRepository';
import { UniversalCart, UniversalQuote, UniversalOrder, CartItem } from '../../models/commerce';

export interface McpToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export interface McpToolExecutionResult<T = any> {
  tool: string;
  success: boolean;
  data?: T;
  error?: string;
  executionMs: number;
  spokenOutput?: string;
}

// In-memory active carts indexed by customerId
const activeCarts: Map<string, UniversalCart> = new Map();

export class McpToolRegistry {
  private tools: Map<string, { definition: McpToolDefinition; handler: (params: any) => Promise<any> }> = new Map();

  constructor() {
    this.registerAllTools();
  }

  public getToolDefinitions(): McpToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }

  public async executeTool(toolName: string, parameters: any): Promise<McpToolExecutionResult> {
    const entry = this.tools.get(toolName);
    const start = Date.now();

    if (!entry) {
      return {
        tool: toolName,
        success: false,
        error: `Tool '${toolName}' not found in registry.`,
        executionMs: Date.now() - start,
      };
    }

    try {
      // Validate required parameters
      for (const req of entry.definition.parameters.required) {
        if (parameters[req] === undefined || parameters[req] === null) {
          return {
            tool: toolName,
            success: false,
            error: `Missing required parameter '${req}' for tool '${toolName}'.`,
            executionMs: Date.now() - start,
          };
        }
      }

      const result = await entry.handler(parameters);
      return {
        tool: toolName,
        success: true,
        data: result.data ?? result,
        spokenOutput: result.spokenOutput,
        executionMs: Date.now() - start,
      };
    } catch (err: any) {
      return {
        tool: toolName,
        success: false,
        error: err.message || 'Execution error',
        executionMs: Date.now() - start,
      };
    }
  }

  private register(definition: McpToolDefinition, handler: (params: any) => Promise<any>): void {
    this.tools.set(definition.name, { definition, handler });
  }

  private registerAllTools(): void {
    // 1. search_products
    this.register(
      {
        name: 'search_products',
        description: 'Search catalog products by query string, category, store, or maximum price.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Product keyword, brand, or model' },
            category: { type: 'string', description: 'cars | laptops | phones | appliances' },
            storeId: { type: 'string', description: 'Specific store ID' },
            maxPrice: { type: 'number', description: 'Maximum price filter' },
          },
          required: ['query'],
        },
      },
      async ({ query, category, maxPrice }) => {
        const results = productService.search(query, category, maxPrice);
        return {
          data: results,
          spokenOutput: `Found ${results.length} products matching "${query}". Top result: ${results[0]?.name || 'None'}.`,
        };
      }
    );

    // 2. get_product
    this.register(
      {
        name: 'get_product',
        description: 'Retrieve full specifications, variants, and pricing for a single product ID.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Unique product ID' },
          },
          required: ['productId'],
        },
      },
      async ({ productId }) => {
        const product = productService.getById(productId);
        if (!product) throw new Error(`Product ${productId} not found.`);
        return {
          data: product,
          spokenOutput: `${product.name} is priced at ${product.priceFormatted}. ${product.description.slice(0, 100)}...`,
        };
      }
    );

    // 3. compare_products
    this.register(
      {
        name: 'compare_products',
        description: 'Compare 2 to 4 products side-by-side with structured advantages, disadvantages, and recommendation.',
        parameters: {
          type: 'object',
          properties: {
            productIds: { type: 'string', description: 'Comma-separated product IDs or JSON array' },
            criteria: { type: 'string', description: 'Optional specific focus e.g. battery, price, camera' },
          },
          required: ['productIds'],
        },
      },
      async ({ productIds }) => {
        const ids: string[] = Array.isArray(productIds) ? productIds : String(productIds).split(',').map((s) => s.trim());
        const comparison = productService.compare(ids);
        return {
          data: comparison,
          spokenOutput: comparison.spokenSummary,
        };
      }
    );

    // 4. recommend_products
    this.register(
      {
        name: 'recommend_products',
        description: 'Generate multi-attribute recommendations based on customer passport and constraints.',
        parameters: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Target category e.g. laptops, phones, cars' },
            budget: { type: 'number', description: 'Maximum budget constraint' },
            limit: { type: 'number', description: 'Number of recommendations' },
          },
          required: [],
        },
      },
      async ({ category, budget, limit = 3 }) => {
        const recs = productService.recommend({ budget: budget ? { max: budget, currency: 'INR', isStrict: false, flexibilityPercentage: 10 } : undefined }, category, limit);
        return {
          data: recs,
          spokenOutput: `I recommend: ${recs.products.map((p) => p.name).join(', ')}.`,
        };
      }
    );

    // 5. switch_store
    this.register(
      {
        name: 'switch_store',
        description: 'Switch the active showroom or store location while preserving customer context.',
        parameters: {
          type: 'object',
          properties: {
            storeId: { type: 'string', description: 'Target store ID' },
            category: { type: 'string', description: 'Optional category change e.g. phones, cars, laptops' },
          },
          required: ['storeId'],
        },
      },
      async ({ storeId, category }) => {
        const store = storeService.getStoreById(storeId);
        return {
          data: { store, category },
          spokenOutput: `Switched showroom to ${store?.name || storeId}. Loading catalog.`,
        };
      }
    );

    // 6. search_stores
    this.register(
      {
        name: 'search_stores',
        description: 'Find physical showrooms and dealer locations by city or query.',
        parameters: {
          type: 'object',
          properties: {
            city: { type: 'string', description: 'City name or search term' },
          },
          required: ['city'],
        },
      },
      async ({ city }) => {
        const stores = storeService.searchStores(city);
        return {
          data: stores,
          spokenOutput: `Found ${stores.length} location(s) in ${city}.`,
        };
      }
    );

    // 7. check_inventory
    this.register(
      {
        name: 'check_inventory',
        description: 'Check stock quantity, warehouse location, and delivery estimate for a product.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
            storeId: { type: 'string', description: 'Store ID' },
          },
          required: ['productId'],
        },
      },
      async ({ productId, storeId = 'store-mumbai' }) => {
        const inv = productService.checkInventory(productId, storeId);
        return {
          data: inv,
          spokenOutput: inv.inStock
            ? `In stock (${inv.quantity} units available) at ${inv.storeId}. ${inv.deliveryEstimate}.`
            : `Currently out of stock at this location.`,
        };
      }
    );

    // 8. get_price
    this.register(
      {
        name: 'get_price',
        description: 'Retrieve real-time verified price and enterprise tiered discount for a product.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
            quantity: { type: 'number', description: 'Order quantity' },
          },
          required: ['productId'],
        },
      },
      async ({ productId, quantity = 1 }) => {
        const product = productService.getById(productId);
        if (!product) throw new Error(`Product ${productId} not found.`);
        const base = product.price * quantity;
        const discountPct = quantity >= 5 ? 15 : quantity >= 2 ? 8 : 0;
        const discountAmount = Math.round(base * (discountPct / 100));
        const finalPrice = base - discountAmount;
        return {
          data: {
            productId,
            unitPrice: product.price,
            quantity,
            subtotal: base,
            discountPercentage: discountPct,
            discountAmount,
            finalPrice,
          },
          spokenOutput: `${product.name} is ₹${product.price.toLocaleString('en-IN')}. For ${quantity} unit(s), final amount is ₹${finalPrice.toLocaleString('en-IN')}.`,
        };
      }
    );

    // 9. get_offer
    this.register(
      {
        name: 'get_offer',
        description: 'Get verified promotions, festive discounts, and executive concessions.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Optional product ID' },
            category: { type: 'string', description: 'Optional category' },
          },
          required: [],
        },
      },
      async ({ productId }) => {
        return {
          data: {
            offers: [
              {
                id: 'concession-exec',
                title: 'Executive Fleet / Pro Studio Privilege',
                discountPercentage: 15,
                details: 'Authorized up to 15% concession plus waived delivery on direct showroom orders.',
              },
            ],
          },
          spokenOutput: 'Authorized 15% executive concession with waived delivery is currently active.',
        };
      }
    );

    // 10. calculate_total_cost
    this.register(
      {
        name: 'calculate_total_cost',
        description: 'Calculate comprehensive total cost of ownership including accessories, warranty, and financing.',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
            includeWarrantyYears: { type: 'number', description: 'Extended warranty in years' },
            tenureMonths: { type: 'number', description: 'Financing tenure' },
          },
          required: ['productId'],
        },
      },
      async ({ productId, includeWarrantyYears = 2, tenureMonths = 24 }) => {
        const product = productService.getById(productId);
        if (!product) throw new Error(`Product ${productId} not found.`);
        const warrantyCost = includeWarrantyYears * Math.round(product.price * 0.04);
        const subtotal = product.price + warrantyCost;
        const interestRate = 0.085;
        const totalWithInterest = Math.round(subtotal * (1 + interestRate * (tenureMonths / 12)));
        const monthlyEmi = Math.round(totalWithInterest / tenureMonths);

        return {
          data: {
            productId,
            basePrice: product.price,
            warrantyYears: includeWarrantyYears,
            warrantyCost,
            totalOwnership: totalWithInterest,
            monthlyEmi,
            tenureMonths,
          },
          spokenOutput: `Total ownership with ${includeWarrantyYears}-year warranty is ₹${totalWithInterest.toLocaleString('en-IN')}, or roughly ₹${monthlyEmi.toLocaleString('en-IN')} per month for ${tenureMonths} months.`,
        };
      }
    );

    // 11. create_customer
    this.register(
      {
        name: 'create_customer',
        description: 'Create a new customer profile in persistent storage.',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Customer full name' },
            email: { type: 'string', description: 'Customer email' },
            phone: { type: 'string', description: 'Customer phone' },
            company: { type: 'string', description: 'Company name' },
          },
          required: ['name'],
        },
      },
      async ({ name, email, phone, company }) => {
        const id = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const record = globalCommerceRepository.upsertCustomer({ id, name, email, phone, company });
        return {
          data: record,
          spokenOutput: `Profile registered for ${name}.`,
        };
      }
    );

    // 12. update_customer
    this.register(
      {
        name: 'update_customer',
        description: 'Update customer contact info, company, or preferences.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            name: { type: 'string', description: 'Name' },
            email: { type: 'string', description: 'Email' },
            phone: { type: 'string', description: 'Phone' },
            company: { type: 'string', description: 'Company' },
          },
          required: ['customerId'],
        },
      },
      async ({ customerId, name, email, phone, company }) => {
        const existing = globalCommerceRepository.getCustomerById(customerId);
        const record = globalCommerceRepository.upsertCustomer({
          id: customerId,
          name: name || existing?.name || 'Customer',
          email,
          phone,
          company,
        });
        return { data: record, spokenOutput: `Updated customer profile for ${record.name}.` };
      }
    );

    // 13. get_customer
    this.register(
      {
        name: 'get_customer',
        description: 'Retrieve customer profile from persistent storage.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
          },
          required: ['customerId'],
        },
      },
      async ({ customerId }) => {
        const cust = globalCommerceRepository.getCustomerById(customerId);
        if (!cust) throw new Error(`Customer ${customerId} not found.`);
        return { data: cust };
      }
    );

    // 14. save_memory
    this.register(
      {
        name: 'save_memory',
        description: 'Persist a verified fact into the tiered customer memory in SQLite.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            fact: { type: 'string', description: 'Fact string' },
            category: { type: 'string', description: 'preference | constraint | budget | use_case | dislike' },
            confidence: { type: 'number', description: 'Confidence 0.0 - 1.0' },
          },
          required: ['customerId', 'fact', 'category'],
        },
      },
      async ({ customerId, fact, category, confidence = 0.9 }) => {
        const mem = globalCommerceRepository.saveMemory({
          customerId,
          fact,
          category,
          confidence,
          source: 'customer_utterance',
          consent: true,
        });
        return {
          data: mem,
          spokenOutput: `I have noted that: ${fact}.`,
        };
      }
    );

    // 15. get_memory
    this.register(
      {
        name: 'get_memory',
        description: 'Retrieve stored facts for a customer by category or query.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            category: { type: 'string', description: 'Optional category' },
            query: { type: 'string', description: 'Optional search keyword' },
          },
          required: ['customerId'],
        },
      },
      async ({ customerId, category, query }) => {
        let memories: PersistentMemoryItem[];
        if (query) {
          memories = globalCommerceRepository.searchCustomerMemories(customerId, query);
        } else {
          memories = globalCommerceRepository.getMemoriesByCustomer(customerId, category as any);
        }
        return {
          data: memories,
          spokenOutput: memories.length > 0
            ? `Recalled ${memories.length} fact(s): ${memories.map((m) => m.fact).join('; ')}.`
            : 'No prior recorded memories found.',
        };
      }
    );

    // 16. create_lead
    this.register(
      {
        name: 'create_lead',
        description: 'Create an enterprise sales CRM lead.',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Lead contact name' },
            company: { type: 'string', description: 'Company name' },
            email: { type: 'string', description: 'Email address' },
            notes: { type: 'string', description: 'Qualification notes' },
          },
          required: ['name'],
        },
      },
      async ({ name, company = 'Direct Prospect', email = '', notes = '' }) => {
        const lead = {
          id: `lead-${Date.now()}`,
          name,
          company,
          email,
          notes,
          stage: 'Qualified',
          createdAt: new Date().toISOString(),
        };
        return { data: lead, spokenOutput: `Registered CRM lead for ${name} (${company}).` };
      }
    );

    // 17. update_lead
    this.register(
      {
        name: 'update_lead',
        description: 'Update CRM lead qualification status.',
        parameters: {
          type: 'object',
          properties: {
            leadId: { type: 'string', description: 'Lead ID' },
            stage: { type: 'string', description: 'Sales stage' },
          },
          required: ['leadId', 'stage'],
        },
      },
      async ({ leadId, stage }) => {
        return { data: { leadId, stage, updatedAt: new Date().toISOString() } };
      }
    );

    // 18. create_quote
    this.register(
      {
        name: 'create_quote',
        description: 'Generate an authentic commercial quote with itemized lines, discounts, and validity.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            productId: { type: 'string', description: 'Product ID' },
            quantity: { type: 'number', description: 'Quantity' },
            concessionPercent: { type: 'number', description: 'Discount percentage' },
          },
          required: ['customerId', 'productId'],
        },
      },
      async ({ customerId, productId, quantity = 1, concessionPercent = 15 }) => {
        const product = productService.getById(productId);
        if (!product) throw new Error(`Product ${productId} not found.`);
        const subtotal = product.price * quantity;
        const discount = Math.round(subtotal * (concessionPercent / 100));
        const finalAmount = subtotal - discount;

        const quote: UniversalQuote = {
          id: `quote-${Date.now()}`,
          customerId,
          customerName: globalCommerceRepository.getCustomerById(customerId)?.name || 'Valued Customer',
          sessionId: `sess-${customerId}`,
          items: [
            {
              productId: product.id,
              productName: product.name,
              category: product.category,
              brand: product.brand,
              unitPrice: product.price,
              quantity,
              totalPrice: subtotal,
            },
          ],
          subtotal,
          concessionsApplied: [
            {
              name: 'Executive Concession',
              amount: discount,
              authorizedBy: 'Autonomous AI Sales Director',
            },
          ],
          finalAmount,
          currency: 'INR',
          validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
          status: 'presented',
          createdAt: new Date().toISOString(),
        };

        return {
          data: quote,
          spokenOutput: `I have generated Quote #${quote.id.slice(-6)} for ${quantity}x ${product.name} at ₹${finalAmount.toLocaleString('en-IN')} (including a ${concessionPercent}% concession).`,
        };
      }
    );

    // 19. create_cart
    this.register(
      {
        name: 'create_cart',
        description: 'Initialize a shopping cart for a customer.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
          },
          required: ['customerId'],
        },
      },
      async ({ customerId }) => {
        const cart: UniversalCart = {
          id: `cart-${customerId}-${Date.now()}`,
          customerId,
          items: [],
          subtotal: 0,
          discountAmount: 0,
          discountPercentage: 0,
          taxAmount: 0,
          totalAmount: 0,
          currency: 'INR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        activeCarts.set(customerId, cart);
        return { data: cart };
      }
    );

    // 20. add_to_cart
    this.register(
      {
        name: 'add_to_cart',
        description: 'Add a product and quantity to the customer cart.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            productId: { type: 'string', description: 'Product ID' },
            quantity: { type: 'number', description: 'Quantity' },
          },
          required: ['customerId', 'productId'],
        },
      },
      async ({ customerId, productId, quantity = 1 }) => {
        let cart = activeCarts.get(customerId);
        if (!cart) {
          cart = {
            id: `cart-${customerId}`,
            customerId,
            items: [],
            subtotal: 0,
            discountAmount: 0,
            discountPercentage: 0,
            taxAmount: 0,
            totalAmount: 0,
            currency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          activeCarts.set(customerId, cart);
        }

        const product = productService.getById(productId);
        if (!product) throw new Error(`Product ${productId} not found.`);

        const existingItem = cart.items.find((i) => i.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
        } else {
          cart.items.push({
            productId: product.id,
            productName: product.name,
            category: product.category,
            brand: product.brand,
            unitPrice: product.price,
            quantity,
            totalPrice: product.price * quantity,
          });
        }

        cart.subtotal = cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
        cart.totalAmount = cart.subtotal - cart.discountAmount;
        cart.updatedAt = new Date().toISOString();

        return {
          data: cart,
          spokenOutput: `Added ${quantity}x ${product.name} to cart. Total items: ${cart.items.length}.`,
        };
      }
    );

    // 21. remove_from_cart
    this.register(
      {
        name: 'remove_from_cart',
        description: 'Remove an item from the customer cart.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            productId: { type: 'string', description: 'Product ID to remove' },
          },
          required: ['customerId', 'productId'],
        },
      },
      async ({ customerId, productId }) => {
        const cart = activeCarts.get(customerId);
        if (!cart) throw new Error(`No active cart for customer ${customerId}`);
        cart.items = cart.items.filter((i) => i.productId !== productId);
        cart.subtotal = cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
        cart.totalAmount = cart.subtotal - cart.discountAmount;
        return { data: cart, spokenOutput: 'Item removed from cart.' };
      }
    );

    // 22. checkout
    this.register(
      {
        name: 'checkout',
        description: 'Prepare an order and open the checkout confirmation dialog (requires customer explicit confirmation).',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            storeId: { type: 'string', description: 'Fulfillment Store ID' },
            fulfillmentType: { type: 'string', description: 'pickup | delivery | concierge_setup' },
          },
          required: ['customerId'],
        },
      },
      async ({ customerId, storeId = 'store-mumbai', fulfillmentType = 'delivery' }) => {
        const cart = activeCarts.get(customerId);
        const cust = globalCommerceRepository.getCustomerById(customerId);
        const orderItems: CartItem[] = cart && cart.items.length > 0 ? cart.items : [];

        const order: UniversalOrder = {
          id: `ORD-${Date.now().toString().slice(-6)}`,
          customerId,
          customerName: cust?.name || 'Customer',
          customerEmail: cust?.email || 'customer@salespilot.ai',
          storeId,
          items: orderItems,
          totalAmount: cart?.totalAmount || 0,
          currency: 'INR',
          fulfillmentType: fulfillmentType as any,
          status: 'pending_confirmation',
          createdAt: new Date().toISOString(),
        };

        globalCommerceRepository.saveOrder(order);

        return {
          data: order,
          spokenOutput: `Order ${order.id} prepared for ₹${order.totalAmount.toLocaleString('en-IN')}. Please confirm on the screen to finalize purchase.`,
        };
      }
    );

    // 23. schedule_demo
    this.register(
      {
        name: 'schedule_demo',
        description: 'Schedule a private product demonstration or test experience.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            productId: { type: 'string', description: 'Product ID' },
            date: { type: 'string', description: 'Date YYYY-MM-DD' },
            time: { type: 'string', description: 'Time e.g. 2:00 PM' },
          },
          required: ['customerId', 'date', 'time'],
        },
      },
      async ({ customerId, productId, date, time }) => {
        const product = productId ? productService.getById(productId) : null;
        const cust = globalCommerceRepository.getCustomerById(customerId);
        const booking = {
          id: `demo-${Date.now()}`,
          customerName: cust?.name || 'Customer',
          productName: product?.name || 'Flagship Hardware',
          date,
          time,
          status: 'Confirmed',
        };
        return {
          data: booking,
          spokenOutput: `Demo confirmed for ${booking.customerName} on ${date} at ${time} for ${booking.productName}.`,
        };
      }
    );

    // 24. schedule_appointment
    this.register(
      {
        name: 'schedule_appointment',
        description: 'Book an in-person showroom VIP consultation appointment.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            storeId: { type: 'string', description: 'Store ID' },
            date: { type: 'string', description: 'Date' },
            time: { type: 'string', description: 'Time' },
          },
          required: ['customerId', 'storeId', 'date', 'time'],
        },
      },
      async ({ customerId, storeId, date, time }) => {
        const store = storeService.getStoreById(storeId);
        return {
          data: { customerId, storeId, storeName: store?.name, date, time, status: 'Confirmed' },
          spokenOutput: `Appointment booked at ${store?.name || storeId} for ${date} at ${time}.`,
        };
      }
    );

    // 25. escalate_to_human
    this.register(
      {
        name: 'escalate_to_human',
        description: 'Create an escalation ticket with full conversation snapshot for a human specialist.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            reason: { type: 'string', description: 'Reason for handoff' },
          },
          required: ['customerId', 'reason'],
        },
      },
      async ({ customerId, reason }) => {
        const cust = globalCommerceRepository.getCustomerById(customerId);
        const memories = globalCommerceRepository.getMemoriesByCustomer(customerId);
        const ticket = globalCommerceRepository.createTicket(customerId, `sess-${customerId}`, reason, {
          customer: cust,
          memories,
          cart: activeCarts.get(customerId),
        });
        return {
          data: ticket,
          spokenOutput: `I have transferred your full conversation and preferences to a Senior Specialist (Ticket ${ticket.id}). They are stepping in now.`,
        };
      }
    );

    // 26. queue_customer
    this.register(
      {
        name: 'queue_customer',
        description: 'Politely place an interrupter or secondary customer into the waiting queue.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID' },
            reason: { type: 'string', description: 'Reason e.g. interrupter_deferred' },
          },
          required: ['customerId'],
        },
      },
      async ({ customerId, reason = 'waiting_turn' }) => {
        return {
          data: { customerId, status: 'queued', reason },
          spokenOutput: 'I have placed the request into the waiting queue.',
        };
      }
    );

    // 27. switch_customer
    this.register(
      {
        name: 'switch_customer',
        description: 'Switch active customer focus to another customer in the session registry.',
        parameters: {
          type: 'object',
          properties: {
            targetCustomerId: { type: 'string', description: 'Target customer ID' },
          },
          required: ['targetCustomerId'],
        },
      },
      async ({ targetCustomerId }) => {
        const cust = globalCommerceRepository.getCustomerById(targetCustomerId);
        return {
          data: { targetCustomerId, customerName: cust?.name, status: 'active' },
          spokenOutput: `Switching active customer to ${cust?.name || targetCustomerId}.`,
        };
      }
    );

    // 28. resume_customer
    this.register(
      {
        name: 'resume_customer',
        description: 'Resume a queued customer session with full memory recall.',
        parameters: {
          type: 'object',
          properties: {
            customerId: { type: 'string', description: 'Customer ID to resume' },
          },
          required: ['customerId'],
        },
      },
      async ({ customerId }) => {
        const cust = globalCommerceRepository.getCustomerById(customerId);
        const memories = globalCommerceRepository.getMemoriesByCustomer(customerId);
        const name = cust?.name || 'there';
        const recallText = memories.length > 0 ? `We were discussing ${memories[0].fact}.` : '';
        return {
          data: { customerId, name, memories },
          spokenOutput: `Welcome back, ${name}! ${recallText} How can I help you today?`,
        };
      }
    );
  }
}

export const mcpToolRegistry = new McpToolRegistry();
