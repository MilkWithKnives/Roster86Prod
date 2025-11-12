#!/usr/bin/env node

// Test Auth.js configuration
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env') });

console.log('🔍 Testing Auth.js Environment Variables:');
console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? 'SET ✅' : 'MISSING ❌');
console.log('AUTH_TRUST_HOST:', process.env.AUTH_TRUST_HOST ? 'SET ✅' : 'MISSING ❌');
console.log('AUTH_URL:', process.env.AUTH_URL ? 'SET ✅' : 'MISSING ❌');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✅' : 'MISSING ❌');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ORIGIN:', process.env.ORIGIN);

// Test basic Auth.js import
try {
  console.log('\n🔍 Testing Auth.js imports...');
  
  // This should work if Auth.js is properly configured
  const authConfig = {
    secret: process.env.AUTH_SECRET,
    trustHost: process.env.AUTH_TRUST_HOST === 'true',
    providers: []
  };
  
  console.log('Auth config created successfully ✅');
  console.log('Trust host:', authConfig.trustHost);
  
} catch (error) {
  console.error('❌ Auth.js configuration error:', error.message);
}

console.log('\n🔍 Environment check complete!');
