import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { CustomerDecisionPassport, createInitialPassport } from '../../models/passport';
import { UniversalCart, UniversalQuote, UniversalOrder } from '../../models/commerce';

export type MemoryCategory =
  | 'preference'
  | 'constraint'
  | 'budget'
  | 'use_case'
  | 'dislike'
  | 'decision'
  | 'objection'
  | 'identity'
  | 'general';

export interface PersistentMemoryItem {
  id: string;
  customerId: string;
  fact: string;
  category: MemoryCategory;
  confidence: number; // 0.0 - 1.0
  source: 'customer_utterance' | 'agent_inference' | 'explicit_form';
  createdAt: string;
  updatedAt: string;
  consent: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSessionRecord {
  id: string;
  customerId: string;
  speakerId: string;
  status: 'active' | 'interrupted' | 'queued' | 'waiting' | 'resumed' | 'completed' | 'escalated';
  currentStoreId: string;
  passport: CustomerDecisionPassport;
  transcript: Array<{ speaker: string; text: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationTicketRecord {
  id: string;
  customerId: string;
  sessionId: string;
  reason: string;
  snapshot: Record<string, any>;
  status: 'pending' | 'claimed' | 'resolved';
  createdAt: string;
}

export interface IMemoryRepository {
  saveMemory(item: Omit<PersistentMemoryItem, 'id' | 'createdAt' | 'updatedAt'>): PersistentMemoryItem;
  getMemoriesByCustomer(customerId: string, category?: MemoryCategory): PersistentMemoryItem[];
  searchCustomerMemories(customerId: string, query: string): PersistentMemoryItem[];
  deleteMemory(id: string): boolean;
}

export interface ICustomerRepository {
  upsertCustomer(customer: Partial<CustomerRecord> & { id: string; name: string }): CustomerRecord;
  getCustomerById(id: string): CustomerRecord | null;
  findCustomerByName(name: string): CustomerRecord | null;
  getAllCustomers(): CustomerRecord[];
}

export interface ISessionRepository {
  saveSession(session: CustomerSessionRecord): void;
  getSessionById(id: string): CustomerSessionRecord | null;
  getSessionsByCustomer(customerId: string): CustomerSessionRecord[];
  getActiveSession(): CustomerSessionRecord | null;
  getAllSessions(): CustomerSessionRecord[];
  updateSessionStatus(sessionId: string, status: CustomerSessionRecord['status']): void;
}

export interface IOrderRepository {
  saveOrder(order: UniversalOrder): void;
  getOrderById(id: string): UniversalOrder | null;
  getOrdersByCustomer(customerId: string): UniversalOrder[];
}

export interface IEscalationRepository {
  createTicket(customerId: string, sessionId: string, reason: string, snapshot: Record<string, any>): EscalationTicketRecord;
  getTicketById(id: string): EscalationTicketRecord | null;
  getAllTickets(): EscalationTicketRecord[];
}

export class SqliteCommerceRepository
  implements
    IMemoryRepository,
    ICustomerRepository,
    ISessionRepository,
    IOrderRepository,
    IEscalationRepository
{
  private db: DatabaseSync;

  constructor(dbFilePath?: string) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const resolvedPath = dbFilePath || path.join(dataDir, 'salespilot.sqlite');
    this.db = new DatabaseSync(resolvedPath);
    this.initTables();
  }

  private initTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        role TEXT,
        metadata_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        speaker_id TEXT NOT NULL,
        status TEXT NOT NULL,
        current_store_id TEXT NOT NULL,
        passport_json TEXT NOT NULL,
        transcript_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        fact TEXT NOT NULL,
        category TEXT NOT NULL,
        confidence REAL NOT NULL,
        source TEXT NOT NULL,
        consent INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        store_id TEXT NOT NULL,
        total_amount REAL NOT NULL,
        currency TEXT NOT NULL,
        fulfillment_type TEXT NOT NULL,
        status TEXT NOT NULL,
        order_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS escalations (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        snapshot_json TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  // --- ICustomerRepository ---
  upsertCustomer(cust: Partial<CustomerRecord> & { id: string; name: string }): CustomerRecord {
    const now = new Date().toISOString();
    const existing = this.getCustomerById(cust.id);
    const createdAt = existing ? existing.createdAt : now;
    const email = cust.email ?? existing?.email ?? null;
    const phone = cust.phone ?? existing?.phone ?? null;
    const company = cust.company ?? existing?.company ?? null;
    const role = cust.role ?? existing?.role ?? null;
    const metadata = { ...(existing?.metadata || {}), ...(cust.metadata || {}) };

    const stmt = this.db.prepare(`
      INSERT INTO customers (id, name, email, phone, company, role, metadata_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        email = excluded.email,
        phone = excluded.phone,
        company = excluded.company,
        role = excluded.role,
        metadata_json = excluded.metadata_json,
        updated_at = excluded.updated_at;
    `);

    stmt.run(cust.id, cust.name, email, phone, company, role, JSON.stringify(metadata), createdAt, now);

    return {
      id: cust.id,
      name: cust.name,
      email: email || undefined,
      phone: phone || undefined,
      company: company || undefined,
      role: role || undefined,
      metadata,
      createdAt,
      updatedAt: now,
    };
  }

  getCustomerById(id: string): CustomerRecord | null {
    const row = this.db.prepare('SELECT * FROM customers WHERE id = ?').get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email || undefined,
      phone: row.phone || undefined,
      company: row.company || undefined,
      role: row.role || undefined,
      metadata: row.metadata_json ? JSON.parse(row.metadata_json) : {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  findCustomerByName(name: string): CustomerRecord | null {
    const row = this.db
      .prepare('SELECT * FROM customers WHERE LOWER(name) LIKE ? ORDER BY updated_at DESC LIMIT 1')
      .get(`%${name.toLowerCase()}%`) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email || undefined,
      phone: row.phone || undefined,
      company: row.company || undefined,
      role: row.role || undefined,
      metadata: row.metadata_json ? JSON.parse(row.metadata_json) : {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  getAllCustomers(): CustomerRecord[] {
    const rows = this.db.prepare('SELECT * FROM customers ORDER BY updated_at DESC').all() as any[];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email || undefined,
      phone: row.phone || undefined,
      company: row.company || undefined,
      role: row.role || undefined,
      metadata: row.metadata_json ? JSON.parse(row.metadata_json) : {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // --- IMemoryRepository ---
  saveMemory(item: Omit<PersistentMemoryItem, 'id' | 'createdAt' | 'updatedAt'>): PersistentMemoryItem {
    const now = new Date().toISOString();
    const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const stmt = this.db.prepare(`
      INSERT INTO memories (id, customer_id, fact, category, confidence, source, consent, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      item.customerId,
      item.fact,
      item.category,
      item.confidence,
      item.source,
      item.consent ? 1 : 0,
      now,
      now
    );

    return {
      id,
      customerId: item.customerId,
      fact: item.fact,
      category: item.category,
      confidence: item.confidence,
      source: item.source,
      consent: item.consent,
      createdAt: now,
      updatedAt: now,
    };
  }

  getMemoriesByCustomer(customerId: string, category?: MemoryCategory): PersistentMemoryItem[] {
    let rows: any[];
    if (category) {
      rows = this.db
        .prepare('SELECT * FROM memories WHERE customer_id = ? AND category = ? ORDER BY created_at DESC')
        .all(customerId, category) as any[];
    } else {
      rows = this.db
        .prepare('SELECT * FROM memories WHERE customer_id = ? ORDER BY created_at DESC')
        .all(customerId) as any[];
    }

    return rows.map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      fact: row.fact,
      category: row.category as MemoryCategory,
      confidence: row.confidence,
      source: row.source,
      consent: row.consent === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  searchCustomerMemories(customerId: string, query: string): PersistentMemoryItem[] {
    const rows = this.db
      .prepare('SELECT * FROM memories WHERE customer_id = ? AND LOWER(fact) LIKE ? ORDER BY created_at DESC')
      .all(customerId, `%${query.toLowerCase()}%`) as any[];

    return rows.map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      fact: row.fact,
      category: row.category as MemoryCategory,
      confidence: row.confidence,
      source: row.source,
      consent: row.consent === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  deleteMemory(id: string): boolean {
    const result = this.db.prepare('DELETE FROM memories WHERE id = ?').run(id);
    return (result.changes ?? 0) > 0;
  }

  // --- ISessionRepository ---
  saveSession(session: CustomerSessionRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO sessions (id, customer_id, speaker_id, status, current_store_id, passport_json, transcript_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        customer_id = excluded.customer_id,
        speaker_id = excluded.speaker_id,
        status = excluded.status,
        current_store_id = excluded.current_store_id,
        passport_json = excluded.passport_json,
        transcript_json = excluded.transcript_json,
        updated_at = excluded.updated_at;
    `);

    stmt.run(
      session.id,
      session.customerId,
      session.speakerId,
      session.status,
      session.currentStoreId,
      JSON.stringify(session.passport),
      JSON.stringify(session.transcript),
      session.createdAt,
      session.updatedAt
    );
  }

  getSessionById(id: string): CustomerSessionRecord | null {
    const row = this.db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      customerId: row.customer_id,
      speakerId: row.speaker_id,
      status: row.status,
      currentStoreId: row.current_store_id,
      passport: JSON.parse(row.passport_json),
      transcript: JSON.parse(row.transcript_json),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  getSessionsByCustomer(customerId: string): CustomerSessionRecord[] {
    const rows = this.db
      .prepare('SELECT * FROM sessions WHERE customer_id = ? ORDER BY updated_at DESC')
      .all(customerId) as any[];
    return rows.map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      speakerId: row.speaker_id,
      status: row.status,
      currentStoreId: row.current_store_id,
      passport: JSON.parse(row.passport_json),
      transcript: JSON.parse(row.transcript_json),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getActiveSession(): CustomerSessionRecord | null {
    const row = this.db
      .prepare("SELECT * FROM sessions WHERE status = 'active' ORDER BY updated_at DESC LIMIT 1")
      .get() as any;
    if (!row) return null;
    return {
      id: row.id,
      customerId: row.customer_id,
      speakerId: row.speaker_id,
      status: row.status,
      currentStoreId: row.current_store_id,
      passport: JSON.parse(row.passport_json),
      transcript: JSON.parse(row.transcript_json),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  getAllSessions(): CustomerSessionRecord[] {
    const rows = this.db.prepare('SELECT * FROM sessions ORDER BY updated_at DESC').all() as any[];
    return rows.map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      speakerId: row.speaker_id,
      status: row.status,
      currentStoreId: row.current_store_id,
      passport: JSON.parse(row.passport_json),
      transcript: JSON.parse(row.transcript_json),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  updateSessionStatus(sessionId: string, status: CustomerSessionRecord['status']): void {
    const now = new Date().toISOString();
    this.db.prepare('UPDATE sessions SET status = ?, updated_at = ? WHERE id = ?').run(status, now, sessionId);
  }

  // --- IOrderRepository ---
  saveOrder(order: UniversalOrder): void {
    const stmt = this.db.prepare(`
      INSERT INTO orders (id, customer_id, store_id, total_amount, currency, fulfillment_type, status, order_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        order_json = excluded.order_json;
    `);

    stmt.run(
      order.id,
      order.customerId,
      order.storeId,
      order.totalAmount,
      order.currency,
      order.fulfillmentType,
      order.status,
      JSON.stringify(order),
      order.createdAt
    );
  }

  getOrderById(id: string): UniversalOrder | null {
    const row = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
    if (!row) return null;
    return JSON.parse(row.order_json);
  }

  getOrdersByCustomer(customerId: string): UniversalOrder[] {
    const rows = this.db
      .prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC')
      .all(customerId) as any[];
    return rows.map((r) => JSON.parse(r.order_json));
  }

  // --- IEscalationRepository ---
  createTicket(
    customerId: string,
    sessionId: string,
    reason: string,
    snapshot: Record<string, any>
  ): EscalationTicketRecord {
    const id = `ESC-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO escalations (id, customer_id, session_id, reason, snapshot_json, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, customerId, sessionId, reason, JSON.stringify(snapshot), 'pending', now);

    return {
      id,
      customerId,
      sessionId,
      reason,
      snapshot,
      status: 'pending',
      createdAt: now,
    };
  }

  getTicketById(id: string): EscalationTicketRecord | null {
    const row = this.db.prepare('SELECT * FROM escalations WHERE id = ?').get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      customerId: row.customer_id,
      sessionId: row.session_id,
      reason: row.reason,
      snapshot: JSON.parse(row.snapshot_json),
      status: row.status,
      createdAt: row.created_at,
    };
  }

  getAllTickets(): EscalationTicketRecord[] {
    const rows = this.db.prepare('SELECT * FROM escalations ORDER BY created_at DESC').all() as any[];
    return rows.map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      sessionId: row.session_id,
      reason: row.reason,
      snapshot: JSON.parse(row.snapshot_json),
      status: row.status,
      createdAt: row.created_at,
    }));
  }
}

// Global Singleton Repository
export const globalCommerceRepository = new SqliteCommerceRepository();
