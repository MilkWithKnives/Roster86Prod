import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCheckoutSession, SUBSCRIPTION_PLANS, createStripeCustomer } from '$lib/server/stripe.js';
import { getClientIP, rateLimit, sanitizeInput } from '$lib/server/security.js';
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
		
		// Parse request body
		const { planKey, billingCycle, successUrl, cancelUrl } = await request.json();

		// Validate inputs
		if (!planKey || !SUBSCRIPTION_PLANS[planKey as keyof typeof SUBSCRIPTION_PLANS]) {
			return json({ error: 'Invalid plan selected' }, { status: 400 });
		}

		if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
			return json({ error: 'Invalid billing cycle' }, { status: 400 });
		}

		// Sanitize URLs
		const sanitizedSuccessUrl = sanitizeInput(successUrl);
		const sanitizedCancelUrl = sanitizeInput(cancelUrl);

		const plan = SUBSCRIPTION_PLANS[planKey as keyof typeof SUBSCRIPTION_PLANS];
		
		// Get the correct price ID based on billing cycle
		let priceId = plan.priceId;
		if (billingCycle === 'yearly') {
			// In a real implementation, you'd have separate yearly price IDs
			// For now, we'll use the monthly price ID
			priceId = plan.priceId;
		}

		let customerId: string | undefined;

		// If user is logged in, create or get Stripe customer
		if (session?.user) {
			try {
				// Check if user already has a Stripe customer ID
				const user = await prisma.user.findUnique({
					where: { id: session.user.id },
					select: { stripeCustomerId: true, email: true, name: true }
				});

				if (user?.stripeCustomerId) {
					customerId = user.stripeCustomerId;
				} else {
					// Create new Stripe customer
					const { customer, error } = await createStripeCustomer({
						email: user?.email || session.user.email || '',
						name: user?.name || session.user.name || '',
						metadata: {
							userId: session.user.id,
							planKey
						}
					});

					if (customer) {
						customerId = customer.id;
						
						// Save customer ID to database
						await prisma.user.update({
							where: { id: session.user.id },
							data: { stripeCustomerId: customer.id }
						});
					} else {
						console.error('Failed to create Stripe customer:', error);
					}
				}
			} catch (error) {
				console.error('Error handling Stripe customer:', error);
			}
		}

		// Create checkout session
		const { session: checkoutSession, error } = await createCheckoutSession({
			priceId,
			customerId,
			successUrl: sanitizedSuccessUrl,
			cancelUrl: sanitizedCancelUrl,
			metadata: {
				planKey,
				billingCycle,
				userId: session?.user?.id || 'anonymous'
			}
		});

		if (error || !checkoutSession) {
			console.error('Failed to create checkout session:', error);
			return json({ error: 'Failed to create checkout session' }, { status: 500 });
		}

		return json({ url: checkoutSession.url });

	} catch (error) {
		console.error('Error in create-checkout endpoint:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
