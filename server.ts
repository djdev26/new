import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { detectIntent } from './src/server/intentDetector';
import { detectObjections } from './src/server/objectionDetector';
import {
  getCustomerState,
  getCustomerMemory,
  updateCustomerState,
  setCustomerStage,
} from './src/server/customerStateEngine';
import { calculateQuote } from './src/server/pricingEngine';
import { determineNextBestAction } from './src/server/nextBestActionEngine';
import { generateAgentResponse } from './src/server/objectionResponder';
import { generateNaturalAgentTurn } from './src/server/naturalConversationEngine';
import { productsData, searchKnowledgeBase } from './src/data/knowledge';
import { CrmLead, CalendarBooking, AnalyticsData } from './src/types/salespilot';
import { runSalesPilotUnitTests } from './src/server/tests';
import { conversationOrchestrator } from './src/server/orchestrator/conversationOrchestrator';
import { customerSessionManager } from './src/server/multiCustomerManager';
import { mcpToolRegistry } from './src/server/mcp/toolRegistry';
import { productService } from './src/server/commerce/productService';
import { storeService } from './src/server/commerce/storeService';
import { globalCommerceRepository } from './src/server/storage/sqliteRepository';
import { runComprehensiveTestSuite } from './src/server/tests/comprehensiveTestSuite';
import { runFullE2ESimulation } from './src/server/tests/e2eSimulation';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

// In-memory CRM Leads and Bookings
const leadsDb: CrmLead[] = [
  {
    id: 'lead-101',
    name: 'Priya Sharma',
    company: 'ApexScale Corp',
    email: 'priya.s@apexscale.io',
    userCount: 50,
    plan: 'Growth Plan',
    qualificationScore: 78,
    stage: 'Qualified',
    notes: 'Inbound evaluation of real-time voice qualification.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'lead-102',
    name: 'Marcus Vance',
    company: 'CloudFin Global',
    email: 'm.vance@cloudfin.net',
    userCount: 120,
    plan: 'Enterprise Custom',
    qualificationScore: 92,
    stage: 'Demo Booked',
    notes: 'Requested custom SOC2 voice cloning for 120 SDR seats.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const bookingsDb: CalendarBooking[] = [
  {
    id: 'book-201',
    customerName: 'Marcus Vance',
    company: 'CloudFin Global',
    date: '2026-09-09',
    time: '14:00 EST',
    attendeeEmail: 'm.vance@cloudfin.net',
    notes: 'Enterprise architecture walkthrough with Solutions Director.',
    status: 'Confirmed',
  },
];

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SalesPilot AI Master Enterprise Engine',
    persistence: 'SQLite (node:sqlite)',
    toolsCount: mcpToolRegistry.getToolDefinitions().length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Process conversation message (Master Core Orchestration Endpoint)
app.post('/api/conversation/message', async (req, res) => {
  try {
    const {
      conversation_id = 'default-session',
      speaker = 'customer',
      speakerName = 'Priya',
      speakerId = 'customer-primary',
      activeSpeakerId = 'customer-primary',
      activeSpeakerName = 'Priya',
    } = req.body;
    const text = req.body.text || req.body.utterance || '';

    if (!text) {
      return res.status(400).json({ error: 'Text turn is required' });
    }

    const speakerMeta = {
      speakerId,
      speakerName,
      activeSpeakerId,
      activeSpeakerName,
    };

    const t0 = Date.now();

    // Step 1: Detect Intent & Objections
    const [intentResult, objectionResult] = await Promise.all([
      detectIntent(text),
      detectObjections(text),
    ]);

    // Step 2: Update Customer State Engine for UI telemetry
    const updatedState = updateCustomerState(
      conversation_id,
      text,
      intentResult,
      objectionResult
    );

    // Step 3: Next Best Action Engine reasoning
    const nextAction = determineNextBestAction(updatedState, text);
    updatedState.recommended_action = nextAction;

    // Step 4: Calculate Dynamic Quote
    const quote = calculateQuote(updatedState.user_count, updatedState.product_interest);

    // Step 5: Execute Autonomous Orchestrator (Passport + SQLite Memory + MCP Tools + Priority Lock)
    const activeCust = customerSessionManager.getActiveSession();
    const targetCustId = activeCust.customerId;
    const orchResult = await conversationOrchestrator.processTurn(text, targetCustId, speakerName, speakerId);

    // Step 6: Synchronize UI turn analysis
    const turnAnalysis = generateNaturalAgentTurn(text, updatedState, speakerMeta);
    turnAnalysis.agentSpeech = orchResult.agentSpeech;

    const t3 = Date.now();
    console.log(`[Master Turn Latency] ${t3 - t0}ms | Active Cust: ${targetCustId} | Tools Executed: ${orchResult.toolsExecuted.length}`);

    res.json({
      state: updatedState,
      intent: intentResult,
      objections: objectionResult,
      quote,
      action: nextAction,
      agentResponse: orchResult.agentSpeech,
      analysis: turnAnalysis,
      passport: orchResult.passport,
      toolsExecuted: orchResult.toolsExecuted,
      session: orchResult.session,
    });
  } catch (error: any) {
    console.error('Error processing conversation message:', error);
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

// 3. Multi-Customer Priority & Concurrency Endpoints (Sections 6, 18, 19, 31)
app.get('/api/customers/sessions', (req, res) => {
  const sessions = customerSessionManager.getAllSessions();
  const activeSession = customerSessionManager.getActiveSession();
  
  // Format for client UI
  const uiSessions = sessions.map((s) => ({
    id: s.customerId,
    customerId: s.customerId,
    name: s.name,
    role: s.role,
    company: s.company,
    status: s.status,
    category: s.category,
    storeId: s.storeId,
    state: getCustomerState(s.conversationId),
    passport: s.passport,
    createdAt: s.lastInteraction,
    lastActive: s.lastInteraction,
    memorySnippet: globalCommerceRepository.getMemoriesByCustomer(s.customerId)[0]?.fact || 'Initial showroom exploration',
  }));

  res.json({
    activeSessionId: activeSession.customerId,
    sessions: uiSessions,
  });
});

app.post('/api/customers/switch-active', (req, res) => {
  const { sessionId } = req.body;
  const result = customerSessionManager.switchActiveCustomer(sessionId);
  if (!result.success) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(result);
});

// 4. Customer State, Passport & Memory Endpoints
app.get('/api/customer/:id', (req, res) => {
  const state = getCustomerState(req.params.id);
  res.json(state);
});

app.get('/api/customer/:id/passport', (req, res) => {
  const session = customerSessionManager.getSession(req.params.id);
  res.json({ passport: session?.passport || null });
});

app.get('/api/customer/:id/memory', (req, res) => {
  const memories = globalCommerceRepository.getMemoriesByCustomer(req.params.id);
  res.json({ memory: memories.map((m) => m.fact), detailedMemories: memories });
});

app.post('/api/customer/:id/memory', (req, res) => {
  const { fact, category = 'preference', confidence = 0.9 } = req.body;
  const mem = globalCommerceRepository.saveMemory({
    customerId: req.params.id,
    fact,
    category,
    confidence,
    source: 'explicit_form',
    consent: true,
  });
  res.json({ success: true, memory: mem });
});

// 5. MCP Tool Endpoints (Section 20)
app.get('/api/mcp/tools', (req, res) => {
  const tools = mcpToolRegistry.getToolDefinitions();
  res.json({ count: tools.length, tools });
});

app.post('/api/mcp/execute', async (req, res) => {
  const { toolName, parameters = {} } = req.body;
  const result = await mcpToolRegistry.executeTool(toolName, parameters);
  res.json(result);
});

// 6. Universal Stores & Showrooms Endpoints (Section 3, 19)
app.get('/api/stores', (req, res) => {
  const stores = storeService.getAllStores();
  res.json({ stores });
});

app.post('/api/stores/switch', async (req, res) => {
  const { storeId, category } = req.body;
  const result = await mcpToolRegistry.executeTool('switch_store', { storeId, category });
  res.json(result);
});

// 7. Dynamic Product Comparison & Recommendation Endpoints (Section 16, 17, 18)
app.post('/api/products/compare', async (req, res) => {
  const { productIds, customerId } = req.body;
  const session = customerId ? customerSessionManager.getSession(customerId) : undefined;
  const ids = Array.isArray(productIds) ? productIds : String(productIds).split(',');
  const comparison = productService.compare(ids, session?.passport);
  res.json({ comparison });
});

app.post('/api/products/recommend', (req, res) => {
  const { category, customerId, budget, limit = 3 } = req.body;
  const session = customerId ? customerSessionManager.getSession(customerId) : undefined;
  const recs = productService.recommend(session?.passport || (budget ? { budget: { max: budget, currency: 'INR', isStrict: false, flexibilityPercentage: 10 } } : {}), category, limit);
  res.json(recs);
});

// 8. Pricing & Knowledge Endpoints
app.post('/api/quote/calculate', (req, res) => {
  const { user_count = 50, plan, requirements } = req.body;
  const quote = calculateQuote(Number(user_count), plan, requirements);
  res.json(quote);
});

app.post('/api/knowledge/search', (req, res) => {
  const { query = '' } = req.body;
  const results = searchKnowledgeBase(query);
  res.json({ results });
});

app.get('/api/products', (req, res) => {
  const products = productService.getAll();
  res.json({ products });
});

// 9. Agora Real-Time Voice Token Endpoint
app.post('/api/agora/token', (req, res) => {
  const { channelName = 'salespilot-room-1', uid = 1001 } = req.body;
  const agoraAppId = process.env.AGORA_APP_ID;
  const agoraCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (agoraAppId && agoraCertificate && agoraAppId !== 'YOUR_AGORA_APP_ID') {
    res.json({
      mode: 'live',
      appId: agoraAppId,
      channel: channelName,
      uid,
      token: `rtc-token-${Date.now()}-${channelName}`,
      isDemo: false,
    });
  } else {
    res.json({
      mode: 'demo',
      appId: 'demo-salespilot-agora-id',
      channel: channelName,
      uid,
      token: `demo-mock-token-${Date.now()}`,
      isDemo: true,
      message: 'Running in low-latency Web Speech + Mock Agora RTC adapter mode.',
    });
  }
});

// 10. CRM & Calendar Endpoints
app.post('/api/crm/lead', (req, res) => {
  const {
    name = 'Priya Sharma',
    company = 'ApexScale Corp',
    email = 'priya.s@apexscale.io',
    userCount = 50,
    plan = 'Growth Plan',
    qualificationScore = 80,
    stage = 'Qualified',
    notes = '',
  } = req.body;

  const newLead: CrmLead = {
    id: `lead-${Date.now()}`,
    name,
    company,
    email,
    userCount,
    plan,
    qualificationScore,
    stage,
    notes,
    createdAt: new Date().toISOString(),
  };

  leadsDb.unshift(newLead);
  res.json({ success: true, lead: newLead });
});

app.post('/api/calendar/book', (req, res) => {
  const {
    conversation_id = 'default-session',
    customerName = 'Priya Sharma',
    company = 'ApexScale Corp',
    date = '2026-09-09',
    time = '11:00 AM EST',
    attendeeEmail = 'priya.s@apexscale.io',
    notes = 'Enterprise Solutions Architecture deep-dive',
  } = req.body;

  const newBooking: CalendarBooking = {
    id: `book-${Date.now()}`,
    customerName,
    company,
    date,
    time,
    attendeeEmail,
    notes,
    status: 'Confirmed',
  };

  bookingsDb.unshift(newBooking);
  setCustomerStage(conversation_id, 'Demo Booked');

  res.json({ success: true, booking: newBooking });
});

// 11. Specialist Escalation Endpoint (Section 14 & 23)
app.post('/api/escalate', (req, res) => {
  const { customerId = 'cust-priya', reason = 'Customer requested senior specialist consultation' } = req.body;
  const cust = globalCommerceRepository.getCustomerById(customerId);
  const memories = globalCommerceRepository.getMemoriesByCustomer(customerId);
  const session = customerSessionManager.getSession(customerId);

  const ticket = globalCommerceRepository.createTicket(customerId, session?.conversationId || `conv-${customerId}`, reason, {
    customer: cust,
    memories,
    passport: session?.passport,
    transcript: session?.transcript,
  });

  res.json({
    success: true,
    message: 'Transferred with full context snapshot to Senior Specialist queue.',
    ticketId: ticket.id,
    ticket,
  });
});

// 12. Analytics Data
app.get('/api/analytics', (req, res) => {
  const analytics: AnalyticsData = {
    totalConversations: 184,
    qualifiedLeads: 122,
    avgLeadScore: 81.2,
    demosBooked: 54,
    conversionRate: 29.4,
    escalationsCount: 14,
    avgDurationMinutes: 4.2,
    objectionsBreakdown: [
      { name: 'Pricing & Concessions', count: 58, percentage: 35 },
      { name: 'Weight & Ergonomics', count: 42, percentage: 26 },
      { name: 'Battery Runtime', count: 32, percentage: 19 },
      { name: 'Warranty & Financing', count: 20, percentage: 12 },
      { name: 'Delivery SLA', count: 12, percentage: 8 },
    ],
    competitorMentions: [
      { name: 'Competitor X', count: 48 },
      { name: 'Legacy Brands', count: 32 },
      { name: 'Direct Import', count: 18 },
      { name: 'Other', count: 9 },
    ],
    scoreDistribution: [
      { range: '0-40 (Low)', count: 10 },
      { range: '41-60 (Moderate)', count: 32 },
      { range: '61-80 (Qualified)', count: 74 },
      { range: '81-100 (Ready to Buy)', count: 68 },
    ],
    stageConversionFunnel: [
      { stage: 'New Lead', count: 184 },
      { stage: 'Engaged', count: 162 },
      { stage: 'Qualified', count: 122 },
      { stage: 'Demo Requested', count: 78 },
      { stage: 'Demo Booked', count: 54 },
      { stage: 'Converted', count: 39 },
    ],
  };
  res.json(analytics);
});

// 13. Comprehensive Automated Tests & E2E Simulation Verification Endpoints
app.get('/api/tests/run', (req, res) => {
  const legacyResults = runSalesPilotUnitTests();
  const allPassed = legacyResults.every((r) => r.passed);
  res.json({
    success: allPassed,
    total: legacyResults.length,
    passed: legacyResults.filter((r) => r.passed).length,
    results: legacyResults,
  });
});

app.get('/api/tests/comprehensive', async (req, res) => {
  const suites = await runComprehensiveTestSuite();
  const allPassed = suites.every((s) => s.passed);
  res.json({
    success: allPassed,
    totalSuites: suites.length,
    passedSuites: suites.filter((s) => s.passed).length,
    suites,
  });
});

app.get('/api/tests/e2e', async (req, res) => {
  const e2eResult = await runFullE2ESimulation();
  res.json(e2eResult);
});

// Start server with Vite middleware in development or static dist in production
function tryListen(targetPort: number, maxRetries = 10): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = app.listen(targetPort, '0.0.0.0', () => {
      resolve(targetPort);
    });
    srv.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        srv.close();
        if (maxRetries > 0) {
          console.warn(`Port ${targetPort} is in use, trying port ${targetPort + 1}...`);
          resolve(tryListen(targetPort + 1, maxRetries - 1));
        } else {
          reject(new Error(`Could not find an available port after 10 attempts`));
        }
      } else {
        reject(err);
      }
    });
  });
}

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || !fs.existsSync(path.join(process.cwd(), 'src'));

  if (isProduction && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      if (hasDist) {
        console.warn('Falling back to pre-built dist assets...');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      } else {
        throw err;
      }
    }
  }

  try {
    const activePort = await tryListen(PORT);
    console.log(`\n======================================================`);
    console.log(`🚀 SalesPilot AI Server Live at: http://localhost:${activePort}`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
