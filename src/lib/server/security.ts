import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMITS = {
	api: { requests: 100, window: 60000 }, // 100 requests per minute for API
	auth: { requests: 5, window: 300000 }, // 5 requests per 5 minutes for auth
	contact: { requests: 3, window: 3600000 } // 3 requests per hour for contact form
};

// Content Security Policy
const CSP_DIRECTIVES = {
	'default-src': ["'self'"],
	'script-src': [
		"'self'",
		"'unsafe-inline'", // Required for SvelteKit
		"'unsafe-eval'", // Required for development
		'https://js.stripe.com',
		'https://checkout.stripe.com',
		'https://cdn.jsdelivr.net',
		'https://unpkg.com'
	],
	'style-src': [
		"'self'",
		"'unsafe-inline'", // Required for component styles
		'https://fonts.googleapis.com',
		'https://cdn.jsdelivr.net'
	],
	'font-src': [
		"'self'",
		'https://fonts.gstatic.com',
		'data:'
	],
	'img-src': [
		"'self'",
		'data:',
		'blob:',
		'https:',
		'https://images.unsplash.com',
		'https://avatars.githubusercontent.com'
	],
	'connect-src': [
		"'self'",
		'https://api.stripe.com',
		'https://checkout.stripe.com',
		'wss://localhost:*', // WebSocket for dev
		dev ? 'ws://localhost:*' : ''
	].filter(Boolean),
	'frame-src': [
		'https://js.stripe.com',
		'https://checkout.stripe.com',
		'https://hooks.stripe.com'
	],
	'object-src': ["'none'"],
	'base-uri': ["'self'"],
	'form-action': ["'self'"],
	'frame-ancestors': ["'none'"],
	'upgrade-insecure-requests': dev ? [] : ['']
};

// Generate CSP header value
function generateCSP(): string {
	return Object.entries(CSP_DIRECTIVES)
		.map(([directive, sources]) => {
			if (sources.length === 0) return directive;
			return `${directive} ${sources.join(' ')}`;
		})
		.join('; ');
}

// Rate limiting function
export function rateLimit(identifier: string, type: keyof typeof RATE_LIMITS): boolean {
	const limit = RATE_LIMITS[type];
	const now = Date.now();
	const key = `${type}:${identifier}`;
	
	const current = rateLimitStore.get(key);
	
	if (!current || now > current.resetTime) {
		rateLimitStore.set(key, { count: 1, resetTime: now + limit.window });
		return true;
	}
	
	if (current.count >= limit.requests) {
		return false;
	}
	
	current.count++;
	return true;
}

// Get client IP address
export function getClientIP(request: Request): string {
	const forwarded = request.headers.get('x-forwarded-for');
	const realIP = request.headers.get('x-real-ip');
	const cfConnectingIP = request.headers.get('cf-connecting-ip');
	
	return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
}

// Security headers middleware
export const securityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	
	// Security headers
	const headers = {
		'Content-Security-Policy': generateCSP(),
		'X-Frame-Options': 'DENY',
		'X-Content-Type-Options': 'nosniff',
		'X-XSS-Protection': '1; mode=block',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
		'Cross-Origin-Embedder-Policy': 'credentialless',
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Resource-Policy': 'same-origin'
	};
	
	// Add HSTS in production
	if (!dev) {
		headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
	}
	
	// Apply headers
	Object.entries(headers).forEach(([key, value]) => {
		response.headers.set(key, value);
	});
	
	return response;
};

// Input sanitization
export function sanitizeInput(input: string): string {
	return input
		.replace(/[<>]/g, '') // Remove potential HTML tags
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+=/gi, '') // Remove event handlers
		.trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email) && email.length <= 254;
}

// Validate phone number format
export function isValidPhone(phone: string): boolean {
	const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
	return phoneRegex.test(phone);
}

// Generate CSRF token
export function generateCSRFToken(): string {
	return crypto.randomUUID();
}

// Validate CSRF token
export function validateCSRFToken(token: string, sessionToken: string): boolean {
	return token === sessionToken;
}
