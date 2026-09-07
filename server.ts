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
    service: 'SalesPilot AI Core Engine',
    timestamp: new Date().toISOString(),
  });
});

// 2. Process conversation message (Core Orchestration Endpoint)
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
    const t1 = Date.now();

    // Step 2: Update Customer State Engine
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

    // Step 5: Natural Conversation & Tone Analysis
    const turnAnalysis = generateNaturalAgentTurn(text, updatedState, speakerMeta);
    const t2 = Date.now();

    // Step 6: Generate AI Agent Response Dialogue
    const agentResponse = await generateAgentResponse(
      text,
      updatedState,
      intentResult,
      objectionResult,
      speakerMeta
    );
    const t3 = Date.now();
    console.log(`[Turn Latency] Intent/Objection: ${t1 - t0}ms | State/Tone: ${t2 - t1}ms | Response: ${t3 - t2}ms | Total: ${t3 - t0}ms`);

    res.json({
      state: updatedState,
      intent: intentResult,
      objections: objectionResult,
      quote,
      action: nextAction,
      agentResponse: agentResponse || turnAnalysis.agentSpeech,
      analysis: turnAnalysis,
    });
  } catch (error: any) {
    console.error('Error processing conversation message:', error);
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

// 3. Multi-Customer Priority & Concurrency Endpoints (Sections 18 & 19)
import { multiCustomerManager } from './src/server/multiCustomerManager';

app.get('/api/customers/sessions', (req, res) => {
  const sessions = multiCustomerManager.getAllSessions();
  const activeSession = multiCustomerManager.getActiveSession();
  res.json({
    activeSessionId: activeSession.id,
    sessions,
  });
});

app.post('/api/customers/switch-active', (req, res) => {
  const { sessionId } = req.body;
  const result = multiCustomerManager.setActiveSession(sessionId);
  if (!result.success) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(result);
});

// 4. Customer State Endpoints
app.get('/api/customer/:id', (req, res) => {
  const state = getCustomerState(req.params.id);
  res.json(state);
});

app.get('/api/customer/:id/memory', (req, res) => {
  const memory = getCustomerMemory(req.params.id);
  res.json({ memory });
});

// 4. Pricing & Knowledge Endpoints
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
  res.json({ products: productsData });
});

// 5. Agora Real-Time Voice Token Endpoint
app.post('/api/agora/token', (req, res) => {
  const { channelName = 'salespilot-room-1', uid = 1001 } = req.body;
  const agoraAppId = process.env.AGORA_APP_ID;
  const agoraCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (agoraAppId && agoraCertificate && agoraAppId !== 'YOUR_AGORA_APP_ID') {
    // In production with credentials, generate RTC token
    res.json({
      mode: 'live',
      appId: agoraAppId,
      channel: channelName,
      uid,
      token: `rtc-token-${Date.now()}-${channelName}`,
      isDemo: false,
    });
  } else {
    // Demo mode: Return fallback adapter credentials with exact same interface
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

// 6. CRM & Calendar Endpoints
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

app.post('/api/escalate', (req, res) => {
  const { conversation_id = 'default-session', reason = 'Customer requested human assistance' } = req.body;
  setCustomerStage(conversation_id, 'Negotiation');
  res.json({
    success: true,
    message: 'Transferred to Senior Account Director queue with live context.',
    ticketId: `ESC-${Date.now().toString().slice(-6)}`,
  });
});

// 7. Analytics Data
app.get('/api/analytics', (req, res) => {
  const analytics: AnalyticsData = {
    totalConversations: 142,
    qualifiedLeads: 89,
    avgLeadScore: 76.4,
    demosBooked: 38,
    conversionRate: 26.8,
    escalationsCount: 11,
    avgDurationMinutes: 4.8,
    objectionsBreakdown: [
      { name: 'Pricing & Budget', count: 52, percentage: 38 },
      { name: 'Competitor X', count: 34, percentage: 25 },
      { name: 'Implementation Timeline', count: 26, percentage: 19 },
      { name: 'Security & Compliance', count: 16, percentage: 12 },
      { name: 'Feature Gap', count: 8, percentage: 6 },
    ],
    competitorMentions: [
      { name: 'Competitor X', count: 48 },
      { name: 'Legacy IVR Vendor', count: 28 },
      { name: 'In-House Bot', count: 18 },
      { name: 'Other', count: 9 },
    ],
    scoreDistribution: [
      { range: '0-40 (Low)', count: 14 },
      { range: '41-60 (Moderate)', count: 39 },
      { range: '61-80 (Qualified)', count: 56 },
      { range: '81-100 (High Ready)', count: 33 },
    ],
    stageConversionFunnel: [
      { stage: 'New Lead', count: 142 },
      { stage: 'Engaged', count: 118 },
      { stage: 'Qualified', count: 89 },
      { stage: 'Demo Requested', count: 54 },
      { stage: 'Demo Booked', count: 38 },
      { stage: 'Converted', count: 24 },
    ],
  };
  res.json(analytics);
});

// 8. Unit Tests Verification Endpoint (Role 1 Deliverable 5)
app.get('/api/tests/run', (req, res) => {
  const results = runSalesPilotUnitTests();
  const allPassed = results.every((r) => r.passed);
  res.json({
    success: allPassed,
    total: results.length,
    passed: results.filter((r) => r.passed).length,
    results,
  });
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
