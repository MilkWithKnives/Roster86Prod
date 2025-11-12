import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Polyfill __dirname and __filename for ES modules in multiple scopes
if (typeof globalThis.__dirname === 'undefined') {
  globalThis.__dirname = __dirname;
}

if (typeof globalThis.__filename === 'undefined') {
  globalThis.__filename = __filename;
}

// Also set on global object for compatibility
if (typeof global !== 'undefined') {
  if (typeof global.__dirname === 'undefined') {
    global.__dirname = __dirname;
  }
  if (typeof global.__filename === 'undefined') {
    global.__filename = __filename;
  }
}

// Ensure global is available
if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

// Additional Node.js compatibility
if (typeof process === 'undefined') {
  globalThis.process = process;
}
