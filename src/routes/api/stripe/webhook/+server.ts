import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyWebhookSignature } from '$lib/server/stripe.js';
import { prisma } from '$lib/server/prisma.js';
import type Stripe from 'stripe';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Get raw body and signature
		const body = await request.text();
		const signature = request.headers.get('stripe-signature');

		if (!signature) {
			console.error('Missing Stripe signature');
			return json({ error: 'Missing signature' }, { status: 400 });
		}

		// Verify webhook signature
		const event = verifyWebhookSignature(body, signature);
		if (!event) {
			console.error('Invalid webhook signature');
			return json({ error: 'Invalid signature' }, { status: 400 });
		}

		console.log('Processing Stripe webhook:', event.type);

		// Handle different event types
		switch (event.type) {
			case 'checkout.session.completed':
				await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
				break;

			case 'customer.subscription.created':
				await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
				break;

			case 'customer.subscription.updated':
				await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
				break;

			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
				break;

			case 'invoice.payment_succeeded':
				await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
				break;

			case 'invoice.payment_failed':
				await handlePaymentFailed(event.data.object as Stripe.Invoice);
				break;

			default:
				console.log('Unhandled webhook event type:', event.type);
		}

		return json({ received: true });

	} catch (error) {
		console.error('Webhook error:', error);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
};

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
	try {
		console.log('Checkout completed for session:', session.id);

		const customerId = session.customer as string;
		const subscriptionId = session.subscription as string;
		const userId = session.metadata?.userId;

		if (userId && userId !== 'anonymous') {
			// Update user with subscription info
			await prisma.user.update({
				where: { id: userId },
				data: {
					stripeCustomerId: customerId,
					stripeSubscriptionId: subscriptionId,
					subscriptionStatus: 'active',
					subscriptionPlan: session.metadata?.planKey || 'starter'
				}
			});

			console.log('Updated user subscription:', userId);
		}
	} catch (error) {
		console.error('Error handling checkout completed:', error);
	}
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
	try {
		console.log('Subscription created:', subscription.id);

		const customerId = subscription.customer as string;

		// Find user by Stripe customer ID
		const user = await prisma.user.findFirst({
			where: { stripeCustomerId: customerId }
		});

		if (user) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					stripeSubscriptionId: subscription.id,
					subscriptionStatus: subscription.status,
					subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
				}
			});

			console.log('Updated user subscription status:', user.id);
		}
	} catch (error) {
		console.error('Error handling subscription created:', error);
	}
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	try {
		console.log('Subscription updated:', subscription.id);

		const user = await prisma.user.findFirst({
			where: { stripeSubscriptionId: subscription.id }
		});

		if (user) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					subscriptionStatus: subscription.status,
					subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
				}
			});

			console.log('Updated subscription status for user:', user.id);
		}
	} catch (error) {
		console.error('Error handling subscription updated:', error);
	}
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	try {
		console.log('Subscription deleted:', subscription.id);

		const user = await prisma.user.findFirst({
			where: { stripeSubscriptionId: subscription.id }
		});

		if (user) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					subscriptionStatus: 'canceled',
					subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
				}
			});

			console.log('Marked subscription as canceled for user:', user.id);
		}
	} catch (error) {
		console.error('Error handling subscription deleted:', error);
	}
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
	try {
		console.log('Payment succeeded for invoice:', invoice.id);
		// Add any additional logic for successful payments
	} catch (error) {
		console.error('Error handling payment succeeded:', error);
	}
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
	try {
		console.log('Payment failed for invoice:', invoice.id);
		
		const customerId = invoice.customer as string;
		const user = await prisma.user.findFirst({
			where: { stripeCustomerId: customerId }
		});

		if (user) {
			// You might want to send an email notification here
			console.log('Payment failed for user:', user.id);
		}
	} catch (error) {
		console.error('Error handling payment failed:', error);
	}
}
