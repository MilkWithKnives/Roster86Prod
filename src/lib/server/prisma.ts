import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Set up __dirname for ES modules to fix Prisma issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set global __dirname for Prisma
globalThis.__dirname = __dirname;
globalThis.__filename = __filename;

// Also set on global object for compatibility
if (typeof global !== 'undefined') {
  global.__dirname = __dirname;
  global.__filename = __filename;
}

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ['error', 'warn']
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
