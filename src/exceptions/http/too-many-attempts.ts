export type RateLimitHeaders = {
  limit?: number;
  remaining?: number;
  retryAfter?: number;
};

export class TooManyAttempts extends Error {
  readonly status = 429;
  readonly retryAfter?: number;
  readonly rateLimitLimit?: number;
  readonly rateLimitRemaining?: number;
  readonly headers: RateLimitHeaders;

  constructor(
    message = 'Accessing the API too quickly',
    headers: RateLimitHeaders = {},
  ) {
    super(message);
    this.name = 'TooManyAttempts';
    this.headers = headers;
    this.retryAfter = headers.retryAfter;
    this.rateLimitLimit = headers.limit;
    this.rateLimitRemaining = headers.remaining;
  }

  static fromResponse(response: Response, bodyText: string): TooManyAttempts {
    const retryAfterRaw = response.headers.get('Retry-After');
    const limitRaw = response.headers.get('X-RateLimit-Limit');
    const remainingRaw = response.headers.get('X-RateLimit-Remaining');

    const headers: RateLimitHeaders = {
      retryAfter: parseOptionalInt(retryAfterRaw),
      limit: parseOptionalInt(limitRaw),
      remaining: parseOptionalInt(remainingRaw),
    };

    return new TooManyAttempts(bodyText || undefined, headers);
  }
}

function parseOptionalInt(value: string | null): number | undefined {
  if (value == null || value === '') {
    return undefined;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
