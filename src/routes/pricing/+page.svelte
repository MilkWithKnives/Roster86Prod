<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { Check, Star, ArrowRight, Zap } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	// Svelte 5 runes mode: Use $props() instead of export let
	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let billingCycle = $state<'monthly' | 'yearly'>('monthly');
	let loading = $state(false);

	// Animation variants
	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 }
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	// Handle plan selection
	async function selectPlan(planKey: string) {
		if (loading) return;
		
		loading = true;
		
		try {
			const response = await fetch('/api/stripe/create-checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					planKey,
					billingCycle,
					successUrl: `${window.location.origin}/dashboard?success=true`,
					cancelUrl: `${window.location.origin}/pricing?canceled=true`
				})
			});

			const result = await response.json();

			if (result.error) {
				console.error('Error creating checkout session:', result.error);
				alert('Error starting checkout. Please try again.');
				return;
			}

			// Redirect to Stripe Checkout
			window.location.href = result.url;
		} catch (error) {
			console.error('Error:', error);
			alert('Error starting checkout. Please try again.');
		} finally {
			loading = false;
		}
	}

	// Calculate yearly discount
	function getYearlyPrice(monthlyPrice: number) {
		return Math.round(monthlyPrice * 12 * 0.8); // 20% discount
	}

	function getDisplayPrice(plan: any) {
		if (billingCycle === 'yearly') {
			return Math.round(getYearlyPrice(plan.price) / 12);
		}
		return plan.price;
	}
</script>

<svelte:head>
	<title>Pricing - Roster86 | Employee Scheduling Software Plans</title>
	<meta name="description" content="Choose the perfect employee scheduling software plan for your restaurant. Start with our free trial. Transparent pricing, no hidden fees." />
	<meta name="keywords" content="employee scheduling software pricing, restaurant scheduling plans, workforce management cost, shift planning subscription" />
</svelte:head>

<!-- Pricing Hero -->
<section class="relative py-24 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<motion.div
			initial={fadeInUp.initial}
			animate={fadeInUp.animate}
			transition={fadeInUp.transition}
			class="text-center"
		>
			<h1 class="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
				Simple, Transparent
				<span class="block bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
					Pricing
				</span>
			</h1>
			<p class="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
				Choose the perfect plan for your restaurant. Start with a 14-day free trial, no credit card required.
			</p>

			<!-- Billing Toggle -->
			<div class="inline-flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg mb-12">
				<button
					class="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 {billingCycle === 'monthly' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'}"
					onclick={() => billingCycle = 'monthly'}
				>
					Monthly
				</button>
				<button
					class="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 {billingCycle === 'yearly' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'}"
					onclick={() => billingCycle = 'yearly'}
				>
					Yearly
					<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Save 20%</span>
				</button>
			</div>
		</motion.div>

		<!-- Pricing Cards -->
		<motion.div
			initial="initial"
			animate="animate"
			variants={staggerContainer}
			class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
		>
			{#each Object.entries(data.plans) as [key, plan], index}
				<motion.div
					variants={fadeInUp}
					class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 {plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}"
				>
					{#if plan.popular}
						<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<div class="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
								<Star class="w-4 h-4 mr-1 fill-current" />
								Most Popular
							</div>
						</div>
					{/if}

					<div class="text-center mb-8">
						<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
						<p class="text-slate-600 dark:text-slate-300 mb-6">{plan.description}</p>
						
						<div class="mb-6">
							<span class="text-5xl font-bold text-slate-900 dark:text-white">${getDisplayPrice(plan)}</span>
							<span class="text-slate-600 dark:text-slate-300">/month</span>
							{#if billingCycle === 'yearly'}
								<div class="text-sm text-green-600 dark:text-green-400 mt-1">
									Billed annually (${getYearlyPrice(plan.price)}/year)
								</div>
							{/if}
						</div>

						<Button
							variant={plan.popular ? 'primary' : 'outline'}
							size="lg"
							class="w-full"
							disabled={loading}
							onclick={() => selectPlan(key)}
						>
							{loading ? 'Processing...' : 'Start Free Trial'}
							<ArrowRight class="w-4 h-4 ml-2" />
						</Button>
					</div>

					<ul class="space-y-4">
						{#each plan.features as feature}
							<li class="flex items-start">
								<Check class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
								<span class="text-slate-600 dark:text-slate-300">{feature}</span>
							</li>
						{/each}
					</ul>
				</motion.div>
			{/each}
		</motion.div>

		<!-- FAQ Section -->
		<motion.div
			initial={fadeInUp.initial}
			animate={fadeInUp.animate}
			transition={{ ...fadeInUp.transition, delay: 0.4 }}
			class="mt-24 max-w-4xl mx-auto"
		>
			<h2 class="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
				Frequently Asked Questions
			</h2>

			<div class="grid md:grid-cols-2 gap-8">
				<div>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
						Can I change plans anytime?
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
						Is there a free trial?
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						Absolutely! All plans come with a 14-day free trial. No credit card required to start.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
						What payment methods do you accept?
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						We accept all major credit cards, debit cards, and ACH bank transfers through Stripe.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
						Can I cancel anytime?
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						Yes, you can cancel your subscription at any time. No cancellation fees or long-term contracts.
					</p>
				</div>
			</div>
		</motion.div>

		<!-- CTA Section -->
		<motion.div
			initial={fadeInUp.initial}
			animate={fadeInUp.animate}
			transition={{ ...fadeInUp.transition, delay: 0.6 }}
			class="mt-24 text-center bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-12"
		>
			<h2 class="text-3xl font-bold text-white mb-4">
				Ready to Transform Your Scheduling?
			</h2>
			<p class="text-primary-100 mb-8 text-lg">
				Join thousands of restaurants already saving time and money with Roster86.
			</p>
			<Button
				variant="secondary"
				size="lg"
				onclick={() => selectPlan('professional')}
				disabled={loading}
			>
				<Zap class="w-5 h-5 mr-2" />
				Start Your Free Trial
			</Button>
		</motion.div>
	</div>
</section>
