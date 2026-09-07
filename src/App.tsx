import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { SalesFunnel } from './components/SalesFunnel';
import { VoiceConsole } from './components/VoiceConsole';
import { TranscriptPanel } from './components/TranscriptPanel';
import { CustomerStateCard } from './components/CustomerStateCard';
import { IntentObjectionPanel } from './components/IntentObjectionPanel';
import { MemoryPanel } from './components/MemoryPanel';
import { NextActionPanel } from './components/NextActionPanel';
import { QuotePanel } from './components/QuotePanel';
import { CompetitorTable } from './components/CompetitorTable';
import { CrmModal, CalendarModal } from './components/CrmCalendarModals';
import { AnalyticsView } from './components/AnalyticsView';
import { RulesExplainModal } from './components/RulesExplainModal';
import { DemoScenarioRunner, DEMO_STEPS, DemoStep } from './components/DemoScenarioRunner';

// New Agora Conversational AI & Autonomous Showroom Components
import { ShowroomCanvas3D } from './components/ShowroomCanvas3D';
import { ShowroomDrawer } from './components/ShowroomDrawer';
import { ProductCatalogSection } from './components/ProductCatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { MultiCustomerPriorityBar, CustomerSessionUI } from './components/MultiCustomerPriorityBar';
import { AgoraConversationalPanel } from './components/AgoraConversationalPanel';
import { AgenticActionConsole } from './components/AgenticActionConsole';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { SHOWROOMS_DATA, SHOWROOM_KEYS, getAllProducts, getProductById } from './data/showrooms';

import { useVoiceCall } from './services/voice/useVoiceCall';
import { apiService, ConversationTurnResponse } from './services/api';
import {
  CustomerState,
  TranscriptTurn,
  IntentResult,
  ObjectionResult,
  QuoteResult,
  AnalyticsData,
  SalesStage,
  CrmLead,
  CalendarBooking,
  ShowroomId,
  ShowroomHotspot,
  AgenticToolCall,
  AgenticToolType,
  PaymentSession,
  AgoraPipelineConfig,
  AgoraPipelineMode,
} from './types/salespilot';
import { getInitialCustomerState } from './server/customerStateEngine';
import { calculateQuote } from './server/pricingEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'rules'>('dashboard');
  const [heroCollapsed, setHeroCollapsed] = useState(false);

  // Core Customer State & Real-time Telemetry
  const [conversationId] = useState(`session-${Date.now()}`);
  const [customerState, setCustomerState] = useState<CustomerState>(() => getInitialCustomerState(conversationId));
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([
    {
      id: 'init-1',
      speaker: 'agent',
      text: "Hello Priya! Welcome to SalesPilot AI. I'm your autonomous showroom sales advisor. I can walk you through our 3D interactive showrooms for performance sports cars, neural laptops, or connected smart appliances, handle trade-offs, and customize configurations on the fly. What catches your eye today?",
      timestamp: '10:00 AM',
    },
  ]);

  const [intentResult, setIntentResult] = useState<IntentResult | null>(null);
  const [objectionResult, setObjectionResult] = useState<ObjectionResult | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult>(() => calculateQuote(1, 'Supercars & SUVs'));
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Multi-Customer Concurrency & Priority State (Sections 18 & 19)
  const [activeSessionId, setActiveSessionId] = useState<string>('cust-priya');
  const [customerSessions, setCustomerSessions] = useState<CustomerSessionUI[]>([
    {
      id: 'cust-priya',
      name: 'Priya Sharma',
      role: 'VP of Engineering',
      company: 'ApexScale Corp',
      status: 'active',
      memorySnippet: 'Evaluating Dell XPS 16 vs MacBook Pro 16 & Porsche 911 executive fleet.',
      state: customerState,
    },
    {
      id: 'cust-rahul',
      name: 'Rahul Verma',
      role: 'Fleet Operations Director',
      company: 'Velocity Logistics',
      status: 'waiting',
      memorySnippet: 'Interested in Porsche 911 Carrera and Land Rover Range Rover SV.',
      state: customerState,
    },
    {
      id: 'cust-ananya',
      name: 'Ananya Roy',
      role: 'Smart Living Architect',
      company: 'Modern Living Residences',
      status: 'waiting',
      memorySnippet: 'Wants 630L LG InstaView and Dyson Air Purifier bundle for penthouses.',
      state: customerState,
    },
  ]);

  // Autonomous Showroom State (3 Showrooms: cars, laptops, appliances)
  const [currentShowroomId, setCurrentShowroomId] = useState<ShowroomId>('cars');
  const [selectedProductId, setSelectedProductId] = useState<string>('car-1');
  const [comparedProducts, setComparedProducts] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [detailProduct, setDetailProduct] = useState<any | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<ShowroomHotspot | null>(null);
  const [lastAutonomousSwitch, setLastAutonomousSwitch] = useState<{
    showroomName: string;
    reason: string;
    timestamp: string;
  } | null>(null);

  // Negotiation & Checkout State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [negotiatedDiscount, setNegotiatedDiscount] = useState<number>(15);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);

  // Agora Real-Time Voice AI Pipeline Config
  const [pipelineConfig, setPipelineConfig] = useState<AgoraPipelineConfig>({
    mode: 'agora_managed',
    sttProvider: 'Deepgram Nova-2',
    llmProvider: 'OpenAI GPT-4o',
    ttsProvider: 'MiniMax Speech',
    freeMinutesRemaining: 284,
    channelName: 'salespilot-room-agora',
    latencyMetrics: {
      sttMs: 118,
      llmMs: 135,
      ttsMs: 82,
      rtcMs: 12,
      totalMs: 347,
    },
  });

  // Autonomous Agent Tool Execution Timeline
  const [toolCalls, setToolCalls] = useState<AgenticToolCall[]>([
    {
      id: 'tool-init',
      toolName: 'switch_showroom',
      label: 'Autonomous 3D Mount',
      arguments: { showroomId: 'cars', model: 'Porsche 911 Carrera' },
      timestamp: '10:00:02 AM',
      status: 'success',
      output: 'Mounted 3D Porsche 911 Carrera (992.2) with 3.0L twin-turbo boxer engine & PASM suspension.',
      durationMs: 72,
    },
  ]);

  // Modals
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isScenarioRunnerOpen, setIsScenarioRunnerOpen] = useState(false);
  const [scenarioStepIndex, setScenarioStepIndex] = useState(0);
  const [isScenarioRunning, setIsScenarioRunning] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial analytics
  useEffect(() => {
    apiService.getAnalytics()
      .then(setAnalyticsData)
      .catch((err) => console.warn('Analytics loading fallback:', err));
  }, []);

  // Autonomous Tool Call Logger Helper
  const logToolCall = useCallback(
    (toolName: AgenticToolType, label: string, args: Record<string, any>, output: string, durationMs: number = 180) => {
      const newCall: AgenticToolCall = {
        id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        toolName,
        label,
        arguments: args,
        timestamp: new Date().toLocaleTimeString(),
        status: 'success',
        output,
        durationMs,
      };
      setToolCalls((prev) => [newCall, ...prev.slice(0, 24)]);
    },
    []
  );

  // Autonomous Showroom Switch Handler
  const handleSelectShowroom = useCallback(
    (id: string, source: 'user' | 'agent' = 'user') => {
      const validId: ShowroomId =
        id === 'laptop' ? 'laptops' : (SHOWROOMS_DATA[id as ShowroomId] ? (id as ShowroomId) : 'cars');
      setCurrentShowroomId(validId);
      const showroom = SHOWROOMS_DATA[validId] || SHOWROOMS_DATA.cars;

      if (source === 'agent') {
        setLastAutonomousSwitch({
          showroomName: showroom.name,
          reason: `Autonomous speech trigger identified context for "${showroom.category}"`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      logToolCall(
        'switch_showroom',
        `${source === 'agent' ? 'Autonomous AI' : 'Manual'} Switch to ${showroom.name.split('(')[0]}`,
        { showroomId: validId, triggeredBy: source },
        `Rendered 3D hardware viewport for ${showroom.name} with ${showroom.hotspots?.length || 0} interactive hotspots. Base price updated to ₹${showroom.basePrice.toLocaleString('en-IN')}.`
      );

      // Recalculate quote based on new showroom base price
      setQuoteResult((prev) => {
        const unitBase = showroom.basePrice;
        const discountAmt = Math.round(unitBase * orderQuantity * (negotiatedDiscount / 100));
        const estimatedPrice = unitBase * orderQuantity - discountAmt;
        return {
          ...prev,
          plan: showroom.badge,
          estimated_price: estimatedPrice,
          breakdown: {
            ...prev.breakdown,
            basePricePerSeat: unitBase,
            discountPercentage: negotiatedDiscount,
            totalBeforeDiscount: unitBase * orderQuantity,
            discountAmount: discountAmt,
          },
        };
      });

      showToast(`Switched showroom to: ${showroom.name}`);
    },
    [logToolCall, orderQuantity, negotiatedDiscount]
  );

  // Autonomous Negotiation & Discount Engine
  const handleNegotiateDiscount = useCallback(
    (requestedDiscount: number = 20, reason: string = 'Autonomous Closer Negotiation') => {
      setNegotiatedDiscount(requestedDiscount);
      const showroom = SHOWROOMS_DATA[currentShowroomId] || SHOWROOMS_DATA.cars;
      const unitBase = showroom.basePrice;
      const baseTotal = unitBase * orderQuantity;
      const discountAmt = Math.round(baseTotal * (requestedDiscount / 100));
      const finalPrice = baseTotal - discountAmt;

      setQuoteResult((prev) => ({
        ...prev,
        estimated_price: finalPrice,
        breakdown: {
          ...prev.breakdown,
          discountPercentage: requestedDiscount,
          totalBeforeDiscount: baseTotal,
          discountAmount: discountAmt,
        },
      }));

      setCustomerState((prev) => ({
        ...prev,
        current_stage: 'Negotiation',
        qualification_score: Math.min(100, prev.qualification_score + 10),
        conversation_memory: [
          ...prev.conversation_memory,
          `Negotiated concession applied: ${requestedDiscount}% Volume Discount (Saved ₹${discountAmt.toLocaleString('en-IN')}) with 30-Day Zero-Risk Guarantee.`,
        ],
      }));

      logToolCall(
        'negotiate_discount',
        `Approved ${requestedDiscount}% Concession Escalation`,
        { requestedDiscount, reason, product: showroom.name, quantity: orderQuantity },
        `Dynamic pricing formula applied ${requestedDiscount}% discount. Customer investment adjusted to ₹${finalPrice.toLocaleString('en-IN')} with waived onboarding fee.`
      );

      showToast(`Autonomous Negotiation: Unlocked ${requestedDiscount}% volume discount!`);
    },
    [currentShowroomId, orderQuantity, logToolCall]
  );

  // Manual / Autonomous Agent Tool Trigger
  const handleTriggerAgenticTool = (toolName: AgenticToolType, args: Record<string, any>) => {
    switch (toolName) {
      case 'switch_showroom':
        handleSelectShowroom(args.showroomId || 'cars', 'agent');
        break;
      case 'negotiate_discount':
        handleNegotiateDiscount(args.requestedDiscount || 20, 'Manual evaluator simulation');
        break;
      case 'make_payment':
        setIsCheckoutModalOpen(true);
        logToolCall('make_payment', 'Opened One-Click Checkout Voucher', args, 'Opened zero-risk checkout modal.');
        break;
      case 'book_calendar':
        setIsCalendarModalOpen(true);
        logToolCall('book_calendar', 'Dispatched Calendar Booking Modal', args, 'Presented solutions architect schedule.');
        break;
      case 'update_database':
        setCustomerState((prev) => ({ ...prev, qualification_score: Math.min(100, prev.qualification_score + 5) }));
        logToolCall('update_database', 'Synchronized CustomerState DB Record', args, 'Postgres/Mongo lead state updated.');
        showToast('Database record synced.');
        break;
      case 'trigger_workflow':
        logToolCall('trigger_workflow', 'Dispatched Enterprise Webhook / Slack Alert', args, 'Dispatched HTTP 200 payload to #sales-enterprise channel.');
        showToast('Slack / Webhook alert dispatched.');
        break;
      default:
        break;
    }
  };

  // Product Selection & 3D Mounting Handler
  const handleSelectProductFor3D = useCallback(
    (product: any) => {
      setSelectedProductId(product.id);
      if (product.showroomId !== currentShowroomId) {
        setCurrentShowroomId(product.showroomId);
      }
      logToolCall(
        'select_product',
        `Mounted 3D Model: ${product.name}`,
        { productId: product.id, showroomId: product.showroomId },
        `Rendered interactive 3D model for ${product.name} with key performance badges and technical specs. Price: ${product.priceFormatted}.`
      );
      showToast(`Mounted 3D Model: ${product.name}`);
    },
    [currentShowroomId, logToolCall]
  );

  const handleToggleCompareProduct = useCallback((product: any) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from comparison.`);
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast('Maximum 3 models can be compared simultaneously.');
        return prev;
      }
      showToast(`Added ${product.name} to side-by-side comparison.`);
      return [...prev, product];
    });
  }, []);

  const handleRemoveComparedProduct = useCallback((id: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleBuyProduct = useCallback((product: any) => {
    setSelectedProductId(product.id);
    setIsCheckoutModalOpen(true);
    logToolCall(
      'make_payment',
      `One-Click Checkout Voucher: ${product.name}`,
      { product: product.name, price: product.priceFormatted },
      'Presented zero-risk checkout modal with 30-day ironclad guarantee.'
    );
  }, [logToolCall]);

  // Multi-Customer Session Switcher
  const handleSwitchCustomerSession = useCallback(async (sessionId: string) => {
    try {
      const res = await apiService.switchActiveSession(sessionId);
      if (res.success && res.session) {
        setActiveSessionId(sessionId);
        setCustomerSessions((prev) =>
          prev.map((s) => ({
            ...s,
            status: s.id === sessionId ? 'active' : 'waiting',
          }))
        );
        showToast(`Switched active customer focus to: ${res.session.name}`);

        if (res.resumePrompt) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setTranscript((prev) => [
            ...prev,
            {
              id: `resume-${Date.now()}`,
              speaker: 'agent',
              text: res.resumePrompt!,
              timestamp,
            },
          ]);
        }
      }
    } catch (err) {
      console.warn('Session switch error:', err);
    }
  }, []);

  // Handler when customer speaks or sends utterance
  const handleProcessUtterance = useCallback(
    async (text: string, speakerName?: string): Promise<string | void> => {
      setIsProcessingTurn(true);
      const activeSession = customerSessions.find((s) => s.id === activeSessionId) || customerSessions[0];
      const effectiveSpeakerName = speakerName || activeSession.name;
      const isInterrupter = speakerName && speakerName !== activeSession.name;

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const customerTurnId = `turn-${Date.now()}`;

      // 1. Append customer turn to transcript immediately with speaker label
      setTranscript((prev) => [
        ...prev,
        {
          id: customerTurnId,
          speaker: 'customer',
          text: isInterrupter ? `[${effectiveSpeakerName}]: "${text}"` : text,
          timestamp,
        },
      ]);

      try {
        // 2. Call real full-stack API endpoint with speaker metadata
        const response: ConversationTurnResponse = await apiService.sendMessage(
          conversationId,
          text,
          {
            speakerName: effectiveSpeakerName,
            activeSpeakerName: activeSession.name,
            activeSpeakerId: activeSession.id,
          }
        );

        // 3. Autonomous Website Control & Action Dispatcher
        if (response.analysis) {
          const { targetShowroom, targetProductId, actionRequired } = response.analysis;
          if (targetShowroom && targetShowroom !== currentShowroomId) {
            handleSelectShowroom(targetShowroom, 'agent');
          }
          if (targetProductId) {
            setSelectedProductId(targetProductId);
          }
          if (actionRequired === 'negotiate') {
            handleNegotiateDiscount(20, 'Addressed reluctance with executive discount & 30-day ironclad guarantee');
          } else if (actionRequired === 'checkout') {
            setIsCheckoutModalOpen(true);
          } else if (actionRequired === 'defer_interrupter') {
            logToolCall(
              'trigger_workflow',
              'Multi-Customer Priority Arbitration',
              { interrupter: effectiveSpeakerName, activeCustomer: activeSession.name },
              `Politely deferred ${effectiveSpeakerName} while maintaining active priority session with ${activeSession.name}.`
            );
          }
        }

        // 4. Update all reactive panels
        if (response.state) setCustomerState(response.state);
        if (response.intent) setIntentResult(response.intent);
        if (response.objections) setObjectionResult(response.objections);

        // Deduct 1 Agora conversation minute
        setPipelineConfig((prev) => ({
          ...prev,
          freeMinutesRemaining: Math.max(0, prev.freeMinutesRemaining - 1),
        }));

        // 5. Append AI Agent turn to transcript
        const agentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setTranscript((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            speaker: 'agent',
            text: response.agentResponse,
            timestamp: agentTimestamp,
          },
        ]);

        setIsProcessingTurn(false);
        return response.agentResponse;
      } catch (error) {
        console.error('Error submitting utterance:', error);
        setIsProcessingTurn(false);
      }
    },
    [conversationId, customerSessions, activeSessionId, currentShowroomId, handleSelectShowroom, handleNegotiateDiscount, logToolCall]
  );

  // Handler when customer interrupts active AI speech (Barge-In)
  const handleInterruption = useCallback(
    (interruptedText: string) => {
      setTranscript((prev) => {
        const copy = [...prev];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].speaker === 'agent') {
            copy[i] = {
              ...copy[i],
              interrupted: true,
              interruptedSnippet: interruptedText,
            };
            break;
          }
        }
        return copy;
      });

      logToolCall(
        'trigger_workflow',
        'Agora VAD Barge-In Audio Cutoff',
        { interruptedSnippet: interruptedText.slice(0, 40) + '...' },
        'Detected customer voice activity mid-sentence. Cancelled audio buffer in 18ms and prepared instant contextual handover.'
      );

      showToast('Agora Barge-In: AI speech cancelled immediately.');
    },
    [logToolCall]
  );

  // Voice AI Hook
  const voice = useVoiceCall({
    onUtteranceSubmitted: handleProcessUtterance,
    onInterruption: handleInterruption,
    conversationId,
  });

  // Simulate Multi-Customer Interruption (Polite Deferral)
  const handleSimulateInterruption = useCallback(
    async (interrupterName: string, utteranceText: string) => {
      showToast(`Interruption incoming from secondary customer: ${interrupterName}`);
      await voice.processCustomerUtterance(utteranceText, false, interrupterName);
    },
    [voice]
  );

  // Action Buttons from Next-Best-Action panel
  const handleBookDemo = () => setIsCalendarModalOpen(true);
  const handleCreateLead = () => setIsCrmModalOpen(true);

  const handleSendPricing = async () => {
    setIsCheckoutModalOpen(true);
  };

  const handleEscalateToHuman = async () => {
    try {
      await apiService.escalate(conversationId, 'Customer requested human handover');
      setCustomerState((prev) => ({ ...prev, current_stage: 'Negotiation' }));
      logToolCall('trigger_workflow', 'Escalated to Human Director Queue', { conversationId }, 'Transferred live session to Senior VP.');
      showToast('Transferred live conversation with transcript to Senior Sales Rep.');
    } catch (err) {
      showToast('Escalated to human rep queue.');
    }
  };

  const handleUpdateQuote = async (seats: number, plan: string) => {
    setOrderQuantity(seats);
    handleNegotiateDiscount(negotiatedDiscount, `Quantity updated to ${seats}`);
  };

  // Submit Lead to CRM
  const handleSubmitLead = async (lead: Partial<CrmLead>) => {
    await apiService.createLead(lead);
    logToolCall('update_database', 'Created New CRM Lead Record', lead, 'Inserted into CRM with score ' + customerState.qualification_score);
    showToast('CRM Lead successfully created and synchronized.');
  };

  // Submit Calendar Booking
  const handleSubmitBooking = async (booking: Partial<CalendarBooking>) => {
    await apiService.bookDemo({ ...booking, conversation_id: conversationId });
    setCustomerState((prev) => ({ ...prev, current_stage: 'Demo Booked' }));
    logToolCall('book_calendar', 'Confirmed Solutions Architect Calendar Slot', booking, 'Dispatched calendar invite to ' + booking.attendeeEmail);
    showToast('Demo booked successfully with solutions architecture team.');
  };

  // Payment Confirmation Handler
  const handlePaymentSuccess = (session: PaymentSession) => {
    setCustomerState((prev) => ({
      ...prev,
      current_stage: 'Converted',
      qualification_score: 100,
      conversation_memory: [
        ...prev.conversation_memory,
        `Payment Approved: ₹${session.amount.toLocaleString('en-IN')} for ${session.seats} units (${session.plan}). Txn ID: ${session.transactionId}`,
      ],
    }));

    logToolCall(
      'make_payment',
      'Payment Authorized & Completed',
      { amount: session.amount, txnId: session.transactionId, customerEmail: session.customerEmail },
      `Transaction authorized successfully. Sales Funnel advanced to CONVERTED.`
    );

    showToast('Payment confirmed! Deal closed successfully.');
  };

  // Demo Scenario Execution Logic
  const executeDemoStep = async (step: DemoStep) => {
    setIsScenarioRunning(true);
    await voice.processCustomerUtterance(step.utterance, step.forceInterruption);
    setScenarioStepIndex((prev) => Math.min(prev + 1, DEMO_STEPS.length));
    setIsScenarioRunning(false);
  };

  const autoPlayAllSteps = async () => {
    setIsScenarioRunning(true);
    for (let i = scenarioStepIndex; i < DEMO_STEPS.length; i++) {
      const step = DEMO_STEPS[i];
      await voice.processCustomerUtterance(step.utterance, step.forceInterruption);
      setScenarioStepIndex(i + 1);
      await new Promise((r) => setTimeout(r, 2200));
    }
    setIsScenarioRunning(false);
    showToast('Demo scenario complete: All 5 steps reasoned through the real pipeline!');
  };

  const resetDemoState = () => {
    const initialState = getInitialCustomerState(conversationId);
    setCustomerState(initialState);
    setScenarioStepIndex(0);
    setCurrentShowroomId('cars');
    setNegotiatedDiscount(15);
    setTranscript([
      {
        id: 'init-1',
        speaker: 'agent',
        text: "Hello Priya! Welcome to SalesPilot AI with full Agora Voice AI. I'm your autonomous sales representative. I can guide you through our 3D showrooms for performance sports cars, neural laptops, or smart appliances, negotiate bulk pricing, or take instant orders. What would you like to explore?",
        timestamp: '10:00 AM',
      },
    ]);
    showToast('Reset demo state to initial buyer baseline.');
  };

  const currentShowroom = SHOWROOMS_DATA[currentShowroomId] || SHOWROOMS_DATA.cars;

  return (
    <div className="min-h-screen bg-[#EEF2F6] text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-xs font-semibold text-slate-800 shadow-xl shadow-slate-300/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunDemoScenario={() => setIsScenarioRunnerOpen(true)}
        isScenarioRunning={isScenarioRunning}
        currentStage={customerState.current_stage}
        leadScore={customerState.qualification_score}
      />

      {/* Landing Hero & Pipeline Graphic */}
      <LandingHero
        onStartLiveDemo={voice.startCall}
        onRunDemoScenario={() => setIsScenarioRunnerOpen(true)}
        isScenarioRunning={isScenarioRunning}
        collapsed={heroCollapsed}
        onToggleCollapse={() => setHeroCollapsed(!heroCollapsed)}
      />

      {/* Main Workspace */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
        {/* Tab 1: Live Voice Console & Main Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Sales Funnel Strip */}
            <SalesFunnel
              currentStage={customerState.current_stage}
              onSelectStage={(stage) => setCustomerState((prev) => ({ ...prev, current_stage: stage }))}
              qualificationScore={customerState.qualification_score}
            />

            {/* Multi-Customer Concurrency & Priority Bar (Sections 18 & 19) */}
            <MultiCustomerPriorityBar
              sessions={customerSessions}
              activeSessionId={activeSessionId}
              onSwitchSession={handleSwitchCustomerSession}
              onSimulateInterruption={handleSimulateInterruption}
              isProcessing={isProcessingTurn}
            />

            {/* Autonomous Showroom Navigator Selector */}
            <ShowroomDrawer
              currentShowroomId={currentShowroomId}
              onSelectShowroom={handleSelectShowroom}
              lastAutonomousSwitch={lastAutonomousSwitch}
            />

            {/* Interactive 3D Product Canvas */}
            <ShowroomCanvas3D
              showroom={currentShowroom}
              activeHotspotId={selectedHotspot?.id}
              onSelectHotspot={setSelectedHotspot}
              isAudioActive={voice.callState === 'listening'}
              audioLevel={voice.audioLevel}
              isAiSpeaking={voice.callState === 'speaking'}
            />

            {/* 10-Product Interactive Catalog Grid for Active Showroom */}
            <ProductCatalogSection
              showroom={currentShowroom}
              selectedProductId={selectedProductId}
              comparedProducts={comparedProducts}
              onSelectProductFor3D={handleSelectProductFor3D}
              onViewProductDetails={(p) => setDetailProduct(p)}
              onToggleCompareProduct={handleToggleCompareProduct}
              onOpenCompareModal={() => setIsCompareModalOpen(true)}
              onBuyProduct={handleBuyProduct}
            />

            {/* Agora Conversational Pipeline Telemetry & Free Minutes */}
            <AgoraConversationalPanel
              pipelineConfig={pipelineConfig}
              onUpdateMode={(mode) => setPipelineConfig((prev) => ({ ...prev, mode }))}
              isInterrupted={voice.callState === 'interrupted'}
              isAiSpeaking={voice.callState === 'speaking'}
              isListening={voice.callState === 'listening'}
            />

            {/* Autonomous Agent Action Dispatcher & Live Tool Timeline */}
            <AgenticActionConsole
              toolCalls={toolCalls}
              onTriggerTool={handleTriggerAgenticTool}
              isExecuting={isProcessingTurn}
            />

            {/* Row 1: Live Voice Console & Live Transcript */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <VoiceConsole
                  callState={voice.callState}
                  isMuted={voice.isMuted}
                  audioLevel={voice.audioLevel}
                  statusMessage={voice.statusMessage}
                  errorMessage={voice.errorMessage}
                  onStartCall={voice.startCall}
                  onEndCall={voice.endCall}
                  onToggleMute={voice.toggleMute}
                  onSubmitUtterance={(text) => voice.processCustomerUtterance(text)}
                  onTriggerHumanTransfer={handleEscalateToHuman}
                  onTriggerBookDemo={handleBookDemo}
                  isProcessing={isProcessingTurn}
                />
              </div>

              <div className="lg:col-span-7">
                <TranscriptPanel transcript={transcript} />
              </div>
            </div>

            {/* Row 2: CustomerState & Next-Best-Action & Dynamic Quote */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustomerStateCard state={customerState} />
              <NextActionPanel
                action={customerState.recommended_action}
                onBookDemo={handleBookDemo}
                onSendPricing={handleSendPricing}
                onCreateLead={handleCreateLead}
                onEscalate={handleEscalateToHuman}
                isActionLoading={isProcessingTurn}
              />
              <QuotePanel
                quote={quoteResult}
                onUpdateQuote={handleUpdateQuote}
                currentUserCount={orderQuantity}
              />
            </div>

            {/* Row 3: Intent & Objection Live Panel & Conversation Memory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IntentObjectionPanel
                intent={intentResult}
                objections={objectionResult}
              />
              <MemoryPanel memoryBullets={customerState.conversation_memory} />
            </div>

            {/* Row 4: Competitor Benchmark Comparison Table */}
            <CompetitorTable />
          </div>
        )}

        {/* Tab 2: Secondary Analytics Dashboard */}
        {activeTab === 'analytics' && analyticsData && (
          <AnalyticsView data={analyticsData} />
        )}

        {/* Tab 3: System Explainability & Rules Guide */}
        {activeTab === 'rules' && <RulesExplainModal />}
      </main>

      {/* Instant Checkout & Negotiation Voucher Modal */}
      <PaymentCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        showroom={currentShowroom}
        quantity={orderQuantity}
        discountPercentage={negotiatedDiscount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Product Detail Inspection Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        onMount3D={handleSelectProductFor3D}
        onBuyNow={handleBuyProduct}
      />

      {/* Product Side-by-Side Comparison Modal */}
      <ProductCompareModal
        products={comparedProducts}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveProduct={handleRemoveComparedProduct}
        onMount3D={handleSelectProductFor3D}
        onBuyNow={handleBuyProduct}
      />

      {/* CRM Modal */}
      <CrmModal
        isOpen={isCrmModalOpen}
        onClose={() => setIsCrmModalOpen(false)}
        state={customerState}
        onSubmitLead={handleSubmitLead}
      />

      {/* Calendar Booking Modal */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        state={customerState}
        onSubmitBooking={handleSubmitBooking}
      />

      {/* Scripted 5-Step Demo Scenario Runner Modal */}
      <DemoScenarioRunner
        isOpen={isScenarioRunnerOpen}
        onClose={() => setIsScenarioRunnerOpen(false)}
        currentStepIndex={scenarioStepIndex}
        isRunning={isScenarioRunning}
        onExecuteStep={executeDemoStep}
        onAutoPlayAll={autoPlayAllSteps}
        onResetDemo={resetDemoState}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">
          SalesPilot AI · Real-Time Conversational Voice AI with Agora SD-RTN · Autonomous Showroom Controller & Negotiation Agent
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Full-Duplex Interruption (Barge-In) · Mic → STT (Deepgram) → LLM (OpenAI/Gemini) → TTS (MiniMax) → Agora RTC
        </p>
      </footer>
    </div>
  );
}
