import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPortalSession } from '$lib/server/stripe.js';
import { getClientIP, rateLimit } from '$lib/server/security.js';
import { prisma } from '$lib/server/prisma.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		// Rate limiting
		const clientIP = getClientIP(request);
		if (!rateLimit(clientIP, 'api')) {
			return json({ error: 'Too many requests' }, { status: 429 });
		}

		// Get session
		const session = await locals.auth();
		if (!session?.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get user's Stripe customer ID
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { stripeCustomerId: true }
		});

		if (!user?.stripeCustomerId) {
			return json({ error: 'No subscription found' }, { status: 404 });
		}

		// Parse request body
		const { returnUrl } = await request.json();

		// Create portal session
		const { session: portalSession, error } = await createPortalSession({
			customerId: user.stripeCustomerId,
			returnUrl: returnUrl || `${new URL(request.url).origin}/dashboard/billing`
		});

		if (error || !portalSession) {
			console.error('Failed to create portal session:', error);
			return json({ error: 'Failed to create portal session' }, { status: 500 });
		}

		return json({ url: portalSession.url });

	} catch (error) {
		console.error('Error in create-portal endpoint:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
