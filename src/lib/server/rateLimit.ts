import type { Handle } from '@sveltejs/kit';
import { getClientIP, rateLimit } from './security.js';
import { json } from '@sveltejs/kit';

// Rate limiting middleware
export const rateLimitMiddleware: Handle = async ({ event, resolve }) => {
	const { url, request } = event;
	const clientIP = getClientIP(request);
	
	// Skip rate limiting for static assets
	if (url.pathname.startsWith('/_app/') || 
		url.pathname.startsWith('/favicon') ||
		url.pathname.endsWith('.css') ||
		url.pathname.endsWith('.js') ||
		url.pathname.endsWith('.png') ||
		url.pathname.endsWith('.jpg') ||
		url.pathname.endsWith('.svg')) {
		return resolve(event);
	}
	
	// Apply different rate limits based on endpoint
	let rateLimitType: 'api' | 'auth' | 'contact' = 'api';
	
	if (url.pathname.startsWith('/api/auth') || 
		url.pathname.includes('login') || 
		url.pathname.includes('signup')) {
		rateLimitType = 'auth';
	} else if (url.pathname.includes('contact') || 
			   url.pathname.includes('support')) {
		rateLimitType = 'contact';
	}
	
	// Check rate limit
	if (!rateLimit(clientIP, rateLimitType)) {
		console.warn(`Rate limit exceeded for IP: ${clientIP} on ${url.pathname}`);
		
		// Return 429 Too Many Requests
		return json(
			{ 
				error: 'Too many requests. Please try again later.',
				retryAfter: rateLimitType === 'auth' ? 300 : rateLimitType === 'contact' ? 3600 : 60
			},
			{ 
				status: 429,
				headers: {
					'Retry-After': (rateLimitType === 'auth' ? 300 : rateLimitType === 'contact' ? 3600 : 60).toString()
				}
			}
		);
	}
	
	return resolve(event);
};

// Enhanced logging for security events
export function logSecurityEvent(event: {
	type: 'rate_limit' | 'invalid_input' | 'csrf_violation' | 'auth_failure';
	ip: string;
	userAgent?: string;
	endpoint?: string;
	details?: any;
}) {
	const timestamp = new Date().toISOString();
	const logEntry = {
		timestamp,
		level: 'SECURITY',
		...event
	};
	
	// In production, send to security monitoring service
	console.warn('SECURITY EVENT:', JSON.stringify(logEntry));
	
	// TODO: Integrate with security monitoring service like Sentry or DataDog
}
