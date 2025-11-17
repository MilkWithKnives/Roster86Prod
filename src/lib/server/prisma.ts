import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { env } from '$env/dynamic/private';

// Set up __dirname for ES modules to fix Prisma issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set global __dirname for Prisma - more comprehensive approach
if (typeof globalThis !== 'undefined') {
  globalThis.__dirname = __dirname;
  globalThis.__filename = __filename;
}

if (typeof global !== 'undefined') {
  global.__dirname = __dirname;
  global.__filename = __filename;
}

// Also set on process.env for Prisma binary resolution
process.env.__dirname = __dirname;
process.env.__filename = __filename;

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error', 'warn'],
		datasources: {
			db: {
				url: env.DATABASE_URL
			}
		}
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
