/**
 * Smoke test for the reactive AsyncPool / rate-limit behaviour.
 * Mocks global fetch: first N calls return 429, then 200.
 */
import { Ploi, TooManyAttempts, AsyncPool } from '../dist/index.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- Unit: AsyncPool directly ---
{
  let attempts = 0;
  const pool = new AsyncPool({ retryIntervalMs: 50 });

  const p = pool.schedule(async () => {
    attempts += 1;
    if (attempts < 3) {
      throw new TooManyAttempts('slow down', { retryAfter: 1 });
    }
    return 'ok';
  });

  const result = await p;
  assert(result === 'ok', 'pool eventually returns ok');
  assert(attempts === 3, `expected 3 attempts, got ${attempts}`);
}

// --- Integration: Ploi.makeAPICall with mocked fetch ---
{
  const originalFetch = globalThis.fetch;
  let calls = 0;
  const callLog = [];

  globalThis.fetch = async (url) => {
    calls += 1;
    callLog.push(String(url));
    if (calls <= 2) {
      return new Response(
        JSON.stringify({ message: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Retry-After': '1',
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }
    return new Response(JSON.stringify({ data: { id: 1, ok: true } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const ploi = new Ploi('test-token', {
      rateLimitRetryIntervalMs: 50,
      userAgent: 'smoke-test',
    });

    const started = Date.now();
    const res = await ploi.makeAPICall('teapot');
    const elapsed = Date.now() - started;

    assert(res.getStatus() === 200, 'final status 200');
    assert(calls === 3, `expected 3 fetch calls, got ${calls}`);
    assert(elapsed >= 90, `expected ~2 retries with delay, elapsed=${elapsed}`);
    assert(ploi.getUserAgent() === 'smoke-test', 'user agent');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// --- Burst: multiple tasks, one 429, then resume ---
{
  const originalFetch = globalThis.fetch;
  let calls = 0;
  let allow = false;

  globalThis.fetch = async () => {
    calls += 1;
    if (!allow && calls === 2) {
      return new Response('rate limited', {
        status: 429,
        headers: { 'Retry-After': '1' },
      });
    }
    return new Response(JSON.stringify({ data: { ok: true } }), { status: 200 });
  };

  try {
    const ploi = new Ploi('tok', { rateLimitRetryIntervalMs: 40 });

    // After a short delay, allow retries to succeed
    setTimeout(() => {
      allow = true;
    }, 80);

    const results = await Promise.all([
      ploi.makeAPICall('a'),
      ploi.makeAPICall('b'),
      ploi.makeAPICall('c'),
    ]);

    assert(results.length === 3, 'all three resolved');
    assert(results.every((r) => r.getStatus() === 200), 'all 200');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// --- Pool disabled: 429 throws immediately ---
{
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response('nope', { status: 429, headers: { 'Retry-After': '5' } });

  try {
    const ploi = new Ploi('tok', { rateLimitPool: false });
    let threw = false;
    try {
      await ploi.makeAPICall('x');
    } catch (e) {
      threw = e instanceof TooManyAttempts;
      assert(e.retryAfter === 5, 'retryAfter from header');
    }
    assert(threw, 'TooManyAttempts thrown when pool disabled');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

console.log('async-pool smoke tests ok');
