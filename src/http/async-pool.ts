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
 * Reactive request pool: burst all pending work, on 429 retry that task
 * every `retryIntervalMs`, then resume bursting the rest.
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
      if (error instanceof TooManyAttempts) {
        await this.handleRateLimit(task);
        return;
      }
      task.reject(error);
    } finally {
      this.inFlight -= 1;
      if (!this.coolingDown && this.pending.length > 0 && this.inFlight === 0) {
        this.drain();
      }
    }
  }

  private async handleRateLimit(task: PoolTask<unknown>): Promise<void> {
    if (this.coolingDown) {
      // Another task is already being retried; keep this one for the next burst.
      this.pending.unshift(task);
      return;
    }

    this.coolingDown = true;

    try {
      for (;;) {
        await sleep(this.retryIntervalMs);
        try {
          const result = await task.run();
          task.resolve(result);
          break;
        } catch (error) {
          if (error instanceof TooManyAttempts) {
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
