// Prisma client wrapper to handle ES module issues
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set global __dirname for Prisma
globalThis.__dirname = __dirname;
globalThis.__filename = __filename;

// Also set on global object
if (typeof global !== 'undefined') {
  global.__dirname = __dirname;
  global.__filename = __filename;
}

// Import Prisma client after setting up globals
const { PrismaClient } = await import('@prisma/client');

export { PrismaClient };
