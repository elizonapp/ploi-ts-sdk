/**
 * Error handling patterns for HTTP + client-side exceptions.
 *
 *   PLOI_API_TOKEN=xxx npx tsx examples/06-errors.ts
 */
import {
  Ploi,
  NotFound,
  NotValid,
  RequiresId,
  Unauthenticated,
} from '../dist/index.js';

async function main() {
  // Missing token
  try {
    const bare = new Ploi();
    bare.getApiToken();
  } catch (error) {
    console.log('no token:', (error as Error).message);
  }

  const ploi = new Ploi(requiredEnv('PLOI_API_TOKEN'));

  // Client-side ID guard
  try {
    await ploi.servers().restart();
  } catch (error) {
    if (error instanceof RequiresId) {
      console.log('RequiresId:', error.message);
    }
  }

  // HTTP 404
  try {
    await ploi.servers(999_999_999).get();
  } catch (error) {
    if (error instanceof NotFound) {
      console.log('NotFound:', error.message.slice(0, 120));
    } else if (error instanceof Unauthenticated) {
      console.log('Unauthenticated — check PLOI_API_TOKEN');
    } else {
      throw error;
    }
  }

  // Illustration: catch validation errors on create
  try {
    await ploi.servers(1).sites().create('');
  } catch (error) {
    if (error instanceof NotValid) {
      console.log('NotValid (422):', error.message.slice(0, 200));
    } else if (error instanceof NotFound) {
      console.log('Server 1 not found — use a real PLOI_SERVER_ID for this check');
    }
  }
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name}`);
  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
