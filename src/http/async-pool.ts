import { TooManyAttempts } from '../exceptions/http/too-many-attempts';

export type AsyncPoolOptions = {
  /** Delay between 429 retries in milliseconds. Default: 1000. */
  retryIntervalMs?: number;
};

type PoolTask<T> = {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process-wide shared pool — Ploi API rate limits are account-global,
 * so every resource (servers, sites, docker, backups, …) must share one queue.
 */
let sharedPool: AsyncPool | null = null;

export function getSharedAsyncPool(options: AsyncPoolOptions = {}): AsyncPool {
  if (!sharedPool) {
    sharedPool = new AsyncPool(options);
  }
  return sharedPool;
}

/** Test helper: drop the shared singleton. */
export function resetSharedAsyncPool(): void {
  sharedPool = null;
}

/**
 * Reactive request pool for the entire Ploi API:
 * burst all pending work → on 429 retry that task every `retryIntervalMs` → burst again.
 *
 * Not related to Laravel site queue workers (`sites().queues()`).
 */
export class AsyncPool {
  private readonly retryIntervalMs: number;
  private readonly pending: PoolTask<unknown>[] = [];
  private inFlight = 0;
  private coolingDown = false;

  constructor(options: AsyncPoolOptions = {}) {
    this.retryIntervalMs = options.retryIntervalMs ?? 1000;
  }

  schedule<T>(run: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.pending.push({
        run: run as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.drain();
    });
  }

  /** Pending + in-flight count (for tests / diagnostics). */
  get size(): number {
    return this.pending.length + this.inFlight;
  }

  private drain(): void {
    if (this.coolingDown) {
      return;
    }

    while (this.pending.length > 0 && !this.coolingDown) {
      const task = this.pending.shift()!;
      this.inFlight += 1;
      void this.execute(task);
    }
  }

  private async execute(task: PoolTask<unknown>): Promise<void> {
    try {
      const result = await task.run();
      task.resolve(result);
    } catch (error) {
      if (isRateLimitError(error)) {
        await this.handleRateLimit(task);
        return;
      }
      task.reject(error);
    } finally {
      this.inFlight -= 1;
      if (!this.coolingDown && this.pending.length > 0) {
        this.drain();
      }
    }
  }

  private async handleRateLimit(task: PoolTask<unknown>): Promise<void> {
    // Another request is already probing the limit — re-queue and wait for next burst.
    if (this.coolingDown) {
      this.pending.unshift(task);
      return;
    }

    // Enter cooldown synchronously (before first await) so concurrent 429s see it.
    this.coolingDown = true;

    try {
      for (;;) {
        await sleep(this.retryIntervalMs);
        try {
          const result = await task.run();
          task.resolve(result);
          break;
        } catch (error) {
          if (isRateLimitError(error)) {
            continue;
          }
          task.reject(error);
          break;
        }
      }
    } finally {
      this.coolingDown = false;
      this.drain();
    }
  }
}

function isRateLimitError(error: unknown): error is TooManyAttempts {
  return (
    error instanceof TooManyAttempts ||
    (typeof error === 'object' &&
      error !== null &&
      (error as { name?: string; status?: number }).name === 'TooManyAttempts') ||
    (typeof error === 'object' &&
      error !== null &&
      (error as { status?: number }).status === 429)
  );
}
