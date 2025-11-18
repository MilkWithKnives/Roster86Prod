import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

// Initialize Stripe only if API key is available
export const stripe = env.STRIPE_SECRET_KEY
	? new Stripe(env.STRIPE_SECRET_KEY, {
		apiVersion: '2024-06-20',
		typescript: true
	})
	: null;

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
	starter: {
		name: 'Starter',
		description: 'Perfect for small restaurants',
		price: 29,
		priceId: env.STRIPE_STARTER_PRICE_ID || '',
		features: [
			'Up to 25 employees',
			'Basic scheduling',
			'Time tracking',
			'Mobile app access',
			'Email support'
		],
		limits: {
			employees: 25,
			locations: 1,
			features: ['basic_scheduling', 'time_tracking', 'mobile_app']
		}
	},
	professional: {
		name: 'Professional',
		description: 'For growing restaurant chains',
		price: 79,
		priceId: env.STRIPE_PROFESSIONAL_PRICE_ID || '',
		features: [
			'Up to 100 employees',
			'AI-powered scheduling',
			'Advanced analytics',
			'Multiple locations',
			'Shift swapping',
			'Priority support'
		],
		limits: {
			employees: 100,
			locations: 5,
			features: ['ai_scheduling', 'analytics', 'multi_location', 'shift_swapping']
		},
		popular: true
	},
	enterprise: {
		name: 'Enterprise',
		description: 'For large restaurant operations',
		price: 199,
		priceId: env.STRIPE_ENTERPRISE_PRICE_ID || '',
		features: [
			'Unlimited employees',
			'Custom integrations',
			'Advanced reporting',
			'Dedicated support',
			'Custom training',
			'SLA guarantee'
		],
		limits: {
			employees: -1, // Unlimited
			locations: -1, // Unlimited
			features: ['all']
		}
	}
};

// Create Stripe checkout session
export async function createCheckoutSession({
	priceId,
	customerId,
	successUrl,
	cancelUrl,
	metadata = {}
}: {
	priceId: string;
	customerId?: string;
	successUrl: string;
	cancelUrl: string;
	metadata?: Record<string, string>;
}) {
	if (!stripe) {
		return { session: null, error: 'Stripe not configured' };
	}

	try {
		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			customer: customerId,
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata,
			allow_promotion_codes: true,
			billing_address_collection: 'required',
			subscription_data: {
				metadata
			}
		});

		return { session, error: null };
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return { session: null, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Create Stripe customer
export async function createStripeCustomer({
	email,
	name,
	metadata = {}
}: {
	email: string;
	name?: string;
	metadata?: Record<string, string>;
}) {
	if (!stripe) {
		return { customer: null, error: 'Stripe not configured' };
	}

	try {
		const customer = await stripe.customers.create({
			email,
			name,
			metadata
		});

		return { customer, error: null };
	} catch (error) {
		console.error('Error creating Stripe customer:', error);
		return { customer: null, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Create customer portal session
export async function createPortalSession({
	customerId,
	returnUrl
}: {
	customerId: string;
	returnUrl: string;
}) {
	if (!stripe) {
		return { session: null, error: 'Stripe not configured' };
	}

	try {
		const session = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: returnUrl
		});

		return { session, error: null };
	} catch (error) {
		console.error('Error creating portal session:', error);
		return { session: null, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
	if (!stripe) {
		return { subscription: null, error: 'Stripe not configured' };
	}

	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
			expand: ['default_payment_method', 'customer']
		});

		return { subscription, error: null };
	} catch (error) {
		console.error('Error retrieving subscription:', error);
		return { subscription: null, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
	if (!stripe) {
		return { subscription: null, error: 'Stripe not configured' };
	}

	try {
		const subscription = await stripe.subscriptions.cancel(subscriptionId);
		return { subscription, error: null };
	} catch (error) {
		console.error('Error canceling subscription:', error);
		return { subscription: null, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Webhook signature verification
export function verifyWebhookSignature(payload: string, signature: string): Stripe.Event | null {
	if (!stripe) {
		console.error('Stripe not configured for webhook verification');
		return null;
	}

	try {
		const event = stripe.webhooks.constructEvent(
			payload,
			signature,
			env.STRIPE_WEBHOOK_SECRET || ''
		);
		return event;
	} catch (error) {
		console.error('Webhook signature verification failed:', error);
		return null;
	}
}
