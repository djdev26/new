import { GoogleGenAI } from '@google/genai';

// Initially trip circuit breaker for known exhausted free-tier key
// Can be reset if user supplies a new valid key
let circuitBreakerOpenUntil = Date.now() + 12 * 60 * 60 * 1000;

export function isGeminiAvailable(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.startsWith('AQ.')) {
    // Keys starting with AQ. are AI Studio free tier service tokens that hit 20/day limit
    return false;
  }
  if (Date.now() < circuitBreakerOpenUntil) {
    return false;
  }
  return true;
}

export function reportGeminiSuccess(): void {
  circuitBreakerOpenUntil = 0;
}

export function reportGeminiFailure(err: any): void {
  // Immediately trip circuit breaker for 30 minutes on any failure
  circuitBreakerOpenUntil = Date.now() + 30 * 60 * 1000;
  console.warn(
    `[SalesPilot Engine] Gemini API unavailable (${err?.message || err}). Running on ultra-fast sub-second Master Sales Engine.`
  );
}

/**
 * Executes a Gemini call with a strict timeout (1500ms)
 * to guarantee real-time conversation responsiveness.
 */
export async function executeWithTimeout<T>(
  promiseFactory: () => Promise<T>,
  timeoutMs: number = 1500
): Promise<T> {
  if (!isGeminiAvailable()) {
    throw new Error('Circuit breaker open or Gemini unavailable');
  }

  let timeoutHandle: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Gemini call timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promiseFactory(), timeoutPromise]);
    clearTimeout(timeoutHandle);
    reportGeminiSuccess();
    return result;
  } catch (err) {
    clearTimeout(timeoutHandle);
    reportGeminiFailure(err);
    throw err;
  }
}

export async function callGemini(prompt: string, timeoutMs: number = 3000): Promise<string> {
  return executeWithTimeout(async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('No GEMINI_API_KEY configured');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || '';
  }, timeoutMs);
}
