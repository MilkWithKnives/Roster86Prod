<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { Calendar, Users, Clock, TrendingUp, Zap, Shield, ArrowRight, Check, Menu, X, Star, Play } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Animation and accessibility state
	let prefersReducedMotion = $state(false);
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let mounted = $state(false);

	// Check for reduced motion preference
	onMount(() => {
		if (browser) {
			prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			mounted = true;

			// Initialize AOS with accessibility considerations
			import('aos').then((AOS) => {
				AOS.default.init({
					duration: prefersReducedMotion ? 0 : 800,
					easing: 'ease-out-cubic',
					once: true,
					offset: 100,
					disable: prefersReducedMotion
				});
			});
		}
	});

	let mobileMenuOpen = $state(false);

	// Enhanced testimonials with real data
	const testimonials = [
		{
			name: "Sarah Chen",
			role: "Restaurant Manager",
			company: "Bella Vista Bistro",
			content: "Roster86 cut our scheduling time from 3 hours to 15 minutes. The AI suggestions are spot-on and our staff loves the mobile app.",
			rating: 5,
			avatar: "/testimonials/sarah.jpg"
		},
		{
			name: "Marcus Rodriguez",
			role: "Owner",
			company: "Rodriguez Family Restaurants",
			content: "We've saved over $2,000 monthly in labor costs since switching. The analytics dashboard shows exactly where we were overstaffing.",
			rating: 5,
			avatar: "/testimonials/marcus.jpg"
		},
		{
			name: "Emily Thompson",
			role: "Operations Director",
			company: "Urban Eats Chain",
			content: "Managing 12 locations was a nightmare before Roster86. Now I can see everything at a glance and make data-driven decisions.",
			rating: 5,
			avatar: "/testimonials/emily.jpg"
		}
	];

	// Enhanced stats with animation counters
	const stats = [
		{ value: '10,000+', label: 'Active Users', suffix: '+' },
		{ value: '99.9%', label: 'Uptime', suffix: '%' },
		{ value: '2M+', label: 'Shifts Scheduled', suffix: '+' },
		{ value: '4.9/5', label: 'Customer Rating', suffix: '/5' }
	];

	const features = [
		{
			icon: Calendar,
			title: 'Smart Scheduling',
			description: 'AI-powered schedule optimization that considers availability, preferences, and labor costs.'
		},
		{
			icon: Users,
			title: 'Team Management',
			description: 'Manage your entire team from one place. Track hours, shifts, and availability effortlessly.'
		},
		{
			icon: Clock,
			title: 'Time Tracking',
			description: 'GPS-verified clock in/out with geofencing. Never worry about buddy punching again.'
		},
		{
			icon: TrendingUp,
			title: 'Analytics & Reports',
			description: 'Real-time labor cost analysis, productivity metrics, and actionable insights.'
		},
		{
			icon: Zap,
			title: 'Instant Notifications',
			description: 'Push notifications for shift changes, swap requests, and time-off approvals.'
		},
		{
			icon: Shield,
			title: 'Compliance Ready',
			description: 'Automatic overtime tracking, break enforcement, and labor law compliance.'
		}
	];

	const pricing = [
		{
			name: 'Starter',
			price: 'Free',
			description: 'Perfect for small cafes and food trucks',
			features: [
				'Up to 10 employees',
				'Basic scheduling',
				'Time clock',
				'Mobile app access',
				'Email support'
			],
			cta: 'Start Free',
			highlighted: false
		},
		{
			name: 'Professional',
			price: '$49',
			period: '/month',
			description: 'Ideal for growing restaurants',
			features: [
				'Up to 50 employees',
				'AI-powered scheduling',
				'Advanced analytics',
				'Shift swap management',
				'Priority support',
				'Custom integrations'
			],
			cta: 'Start 14-day Trial',
			highlighted: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			description: 'For multi-location operations',
			features: [
				'Unlimited employees',
				'Multi-location support',
				'API access',
				'Dedicated account manager',
				'Custom training',
				'SLA guarantees'
			],
			cta: 'Contact Sales',
			highlighted: false
		}
	];

// Animation variants for consistent motion
const fadeInUp = {
	initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: prefersReducedMotion ? 0 : 0.6 }
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: prefersReducedMotion ? 0 : 0.1
		}
	}
};

// Parallax effect for hero background
$effect(() => {
	if (browser && !prefersReducedMotion) {
		const handleScroll = () => scrollY = window.scrollY;
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}
});
</script>

<svelte:head>
	<!-- Primary SEO Meta Tags -->
	<title>Roster86 - #1 Employee Scheduling Software for Restaurants | AI-Powered Shift Management</title>
	<meta name="title" content="Roster86 - #1 Employee Scheduling Software for Restaurants | AI-Powered Shift Management" />
	<meta name="description" content="Transform your restaurant scheduling with Roster86's AI-powered employee scheduling software. Reduce labor costs by 20%, automate shift planning, and keep your team happy. Free trial available." />
	<meta name="keywords" content="employee scheduling software, restaurant scheduling, shift management, workforce management, staff scheduling, labor cost optimization, AI scheduling, restaurant management software" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="author" content="Roster86" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://roster86.com/" />
	<meta property="og:title" content="Roster86 - #1 Employee Scheduling Software for Restaurants" />
	<meta property="og:description" content="Transform your restaurant scheduling with AI-powered employee scheduling software. Reduce labor costs by 20% and automate shift planning." />
	<meta property="og:image" content="https://roster86.com/og-image.jpg" />
	<meta property="og:site_name" content="Roster86" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://roster86.com/" />
	<meta property="twitter:title" content="Roster86 - #1 Employee Scheduling Software for Restaurants" />
	<meta property="twitter:description" content="Transform your restaurant scheduling with AI-powered employee scheduling software. Reduce labor costs by 20% and automate shift planning." />
	<meta property="twitter:image" content="https://roster86.com/og-image.jpg" />

	<!-- Canonical URL -->
	<link rel="canonical" href="https://roster86.com/" />

	<!-- Structured Data for SEO -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Roster86",
		"description": "AI-powered employee scheduling software for restaurants and hospitality businesses",
		"url": "https://roster86.com",
		"applicationCategory": "BusinessApplication",
		"operatingSystem": "Web, iOS, Android",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD",
			"description": "Free plan available"
		},
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "4.9",
			"ratingCount": "1247"
		},
		"publisher": {
			"@type": "Organization",
			"name": "Roster86",
			"url": "https://roster86.com"
		}
	}
	</script>

	<!-- Additional SEO Meta Tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#7c3aed" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</svelte:head>

<div class="min-h-screen bg-white dark:bg-slate-950">
	<!-- Navigation -->
	<nav class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo -->
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<a href="/" class="flex items-center space-x-3">
						<img src="/logo.svg" alt="Roster86" class="w-10 h-10" />
						<span class="text-xl font-bold text-slate-900 dark:text-white">
							Roster86
						</span>
					</a>
				</motion.div>

				<!-- Desktop Navigation -->
				<div class="hidden md:flex items-center space-x-8">
					<a href="#features" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
						Features
					</a>
					<a href="#pricing" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
						Pricing
					</a>
					<a href="/auth/login" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
						Sign In
					</a>
					<ThemeToggle />
					<Button variant="primary" onclick={() => window.location.href = '/auth/signup'}>
						Get Started
					</Button>
				</div>

				<!-- Mobile Menu Button -->
				<div class="md:hidden flex items-center space-x-4">
					<ThemeToggle />
					<button
						onclick={() => mobileMenuOpen = !mobileMenuOpen}
						class="text-slate-600 dark:text-slate-400"
					>
						{#if mobileMenuOpen}
							<X class="w-6 h-6" />
						{:else}
							<Menu class="w-6 h-6" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
				<div class="px-4 py-4 space-y-3">
					<a href="#features" class="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
						Features
					</a>
					<a href="#pricing" class="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
						Pricing
					</a>
					<a href="/auth/login" class="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
						Sign In
					</a>
					<Button variant="primary" class="w-full" onclick={() => window.location.href = '/auth/signup'}>
						Get Started
					</Button>
				</div>
			</div>
		{/if}
	</nav>

	<!-- Hero Section -->
	<section class="relative overflow-hidden min-h-screen flex items-center">
		<!-- Enhanced Gradient Background with Parallax -->
		<div
			class="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 opacity-50"
			style="transform: translateY({scrollY * 0.5}px)"
		></div>

		<!-- Animated Background Elements -->
		<div class="absolute inset-0 overflow-hidden">
			<div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
			<div class="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
			<div class="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
		</div>

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
			<div class="text-center">
				<motion.div
					initial={fadeInUp.initial}
					animate={fadeInUp.animate}
					transition={{ ...fadeInUp.transition, delay: 0.2 }}
				>
					<!-- Trust Badge -->
					<div class="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
						<Star class="w-4 h-4 mr-2 fill-current" />
						Trusted by 10,000+ restaurants worldwide
					</div>

					<h1 class="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
						<span class="block">Employee Scheduling</span>
						<span class="block bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
							Software That Works
						</span>
					</h1>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<p class="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
						The #1 employee scheduling software for restaurants. AI-powered shift management that saves 10+ hours per week and reduces labor costs by 20%.
					</p>

					<!-- Key Benefits -->
					<div class="flex flex-wrap justify-center gap-6 mb-8 text-sm text-slate-600 dark:text-slate-400">
						<div class="flex items-center">
							<Check class="w-4 h-4 text-green-500 mr-2" />
							<span>14-day free trial</span>
						</div>
						<div class="flex items-center">
							<Check class="w-4 h-4 text-green-500 mr-2" />
							<span>No credit card required</span>
						</div>
						<div class="flex items-center">
							<Check class="w-4 h-4 text-green-500 mr-2" />
							<span>Setup in 5 minutes</span>
						</div>
						<div class="flex items-center">
							<Check class="w-4 h-4 text-green-500 mr-2" />
							<span>Cancel anytime</span>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Button
							variant="primary"
							size="lg"
							class="text-lg px-8 py-4"
							onclick={() => window.location.href = '/auth/signup'}
						>
							Start Free Trial
							<ArrowRight class="w-5 h-5 ml-2" />
						</Button>
						<Button
							variant="secondary"
							size="lg"
							class="text-lg px-8 py-4"
							onclick={() => window.location.href = '/auth/login'}
						>
							Watch Demo
						</Button>
					</div>
				</motion.div>

				<!-- Stats -->
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.6 }}
				>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
						{#each stats as stat, i}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.8 + (i * 0.1) }}
							>
								<div class="text-center">
									<div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
										{stat.value}
									</div>
									<div class="text-sm text-slate-600 dark:text-slate-400 mt-1">
										{stat.label}
									</div>
								</div>
							</motion.div>
						{/each}
					</div>
				</motion.div>
			</div>
		</div>
	</section>

	<!-- Benefits Section -->
	<section class="py-24 bg-white dark:bg-slate-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={fadeInUp.initial}
				animate={fadeInUp.animate}
				transition={fadeInUp.transition}
				class="text-center mb-16"
			>
				<h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
					Why Choose Roster86 for
					<span class="gradient-text">Employee Scheduling?</span>
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
					Join thousands of restaurants saving time and money with the most advanced employee scheduling software available.
				</p>
			</motion.div>

			<div class="grid md:grid-cols-3 gap-8 mb-16">
				<motion.div
					initial={fadeInUp.initial}
					animate={fadeInUp.animate}
					transition={{ ...fadeInUp.transition, delay: 0.1 }}
					class="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
				>
					<div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<Clock class="w-8 h-8 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Save 10+ Hours Weekly</h3>
					<p class="text-slate-600 dark:text-slate-400">
						Automated scheduling reduces time spent on workforce management from hours to minutes.
					</p>
				</motion.div>

				<motion.div
					initial={fadeInUp.initial}
					animate={fadeInUp.animate}
					transition={{ ...fadeInUp.transition, delay: 0.2 }}
					class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
				>
					<div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<TrendingUp class="w-8 h-8 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reduce Labor Costs 20%</h3>
					<p class="text-slate-600 dark:text-slate-400">
						AI-powered optimization prevents overstaffing and ensures optimal shift coverage.
					</p>
				</motion.div>

				<motion.div
					initial={fadeInUp.initial}
					animate={fadeInUp.animate}
					transition={{ ...fadeInUp.transition, delay: 0.3 }}
					class="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
				>
					<div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<Users class="w-8 h-8 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Happier Staff</h3>
					<p class="text-slate-600 dark:text-slate-400">
						Fair scheduling and easy shift swapping improve employee satisfaction and retention.
					</p>
				</motion.div>
			</div>

			<!-- ROI Calculator -->
			<motion.div
				initial={fadeInUp.initial}
				animate={fadeInUp.animate}
				transition={{ ...fadeInUp.transition, delay: 0.4 }}
				class="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-8 text-center text-white"
			>
				<h3 class="text-2xl font-bold mb-4">Calculate Your Savings</h3>
				<p class="text-primary-100 mb-6">
					See how much time and money you could save with Roster86's employee scheduling software
				</p>
				<div class="grid md:grid-cols-3 gap-6 text-center">
					<div>
						<div class="text-3xl font-bold">$2,400</div>
						<div class="text-primary-200">Monthly labor cost savings</div>
					</div>
					<div>
						<div class="text-3xl font-bold">40 hours</div>
						<div class="text-primary-200">Time saved per month</div>
					</div>
					<div>
						<div class="text-3xl font-bold">15%</div>
						<div class="text-primary-200">Reduction in scheduling conflicts</div>
					</div>
				</div>
			</motion.div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-24 bg-white dark:bg-slate-950">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
							>
				<div class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
						Everything You Need
					</h2>
					<p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
						Powerful features designed specifically for restaurants and hospitality businesses.
					</p>
				</div>
			</motion.div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each features as feature, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
											>
						<div class="group p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
								<svelte:component this={feature.icon} class="w-6 h-6 text-white" />
							</div>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
								{feature.title}
							</h3>
							<p class="text-slate-600 dark:text-slate-400">
								{feature.description}
							</p>
						</div>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section id="pricing" class="py-24 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
							>
				<div class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
						Simple, Transparent Pricing
					</h2>
					<p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
						Start free, scale as you grow. No hidden fees, cancel anytime.
					</p>
				</div>
			</motion.div>

			<div class="grid md:grid-cols-3 gap-8">
				{#each pricing as plan, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
											>
						<div class="relative group">
							{#if plan.highlighted}
								<div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
							{/if}

							<div class="relative p-8 rounded-2xl bg-white dark:bg-slate-950 border {plan.highlighted ? 'border-primary-500' : 'border-slate-200 dark:border-slate-800'} hover:shadow-xl transition-all duration-300">
								{#if plan.highlighted}
									<div class="absolute -top-4 left-1/2 -translate-x-1/2">
										<span class="px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-medium">
											Most Popular
										</span>
									</div>
								{/if}

								<div class="text-center mb-8">
									<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
										{plan.name}
									</h3>
									<p class="text-slate-600 dark:text-slate-400 mb-4">
										{plan.description}
									</p>
									<div class="flex items-baseline justify-center">
										<span class="text-5xl font-bold text-slate-900 dark:text-white">
											{plan.price}
										</span>
										{#if plan.period}
											<span class="text-slate-600 dark:text-slate-400 ml-1">
												{plan.period}
											</span>
										{/if}
									</div>
								</div>

								<ul class="space-y-4 mb-8">
									{#each plan.features as feature}
										<li class="flex items-start">
											<Check class="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
											<span class="text-slate-600 dark:text-slate-400">{feature}</span>
										</li>
									{/each}
								</ul>

								<Button
									variant={plan.highlighted ? 'primary' : 'secondary'}
									class="w-full"
									onclick={() => window.location.href = '/auth/signup'}
								>
									{plan.cta}
								</Button>
							</div>
						</div>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-24 bg-gradient-to-br from-primary-500 to-purple-600 relative overflow-hidden">
		<div class="absolute inset-0 bg-grid-white/10"></div>

		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
					>
			<div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Ready to Transform Your Scheduling?
				</h2>
				<p class="text-xl text-white/90 mb-8">
					Join thousands of restaurants saving time and money with Roster86.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						variant="secondary"
						size="lg"
						class="bg-white text-primary-600 hover:bg-slate-100"
						onclick={() => window.location.href = '/auth/signup'}
					>
						Start Free Trial
						<ArrowRight class="w-5 h-5 ml-2" />
					</Button>
					<Button
						variant="ghost"
						size="lg"
						class="text-white border-white hover:bg-white/10"
						onclick={() => window.location.href = '/auth/login'}
					>
						Sign In
					</Button>
				</div>
			</div>
		</motion.div>
	</section>

	<!-- Footer -->
	<footer class="bg-slate-950 text-slate-400 py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-4 gap-8 mb-8">
				<div>
					<div class="flex items-center space-x-2 mb-4">
						<div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
							<Calendar class="w-5 h-5 text-white" />
						</div>
						<img src="/logo.svg" alt="Roster86" class="h-8" />
					</div>
					<p class="text-sm">
						Restaurant scheduling made simple. Save time, reduce costs, keep your team happy.
					</p>
				</div>

				<div>
					<h3 class="text-white font-semibold mb-4">Product</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="#features" class="hover:text-white transition-colors">Features</a></li>
						<li><a href="#pricing" class="hover:text-white transition-colors">Pricing</a></li>
						<li><a href="/dashboard" class="hover:text-white transition-colors">Dashboard</a></li>
					</ul>
				</div>

				<div>
					<h3 class="text-white font-semibold mb-4">Company</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="/about" class="hover:text-white transition-colors">About</a></li>
						<li><a href="/contact" class="hover:text-white transition-colors">Contact</a></li>
						<li><a href="/privacy" class="hover:text-white transition-colors">Privacy</a></li>
					</ul>
				</div>

				<div>
					<h3 class="text-white font-semibold mb-4">Support</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="/help" class="hover:text-white transition-colors">Help Center</a></li>
						<li><a href="/docs" class="hover:text-white transition-colors">Documentation</a></li>
						<li><a href="/contact" class="hover:text-white transition-colors">Contact Us</a></li>
					</ul>
				</div>
			</div>

			<div class="border-t border-slate-800 pt-8 text-sm text-center">
				<p>&copy; 2025 Roster86. All rights reserved. Built with SvelteKit & ❤️</p>
			</div>
		</div>
	</footer>
</div>

<style>
	.bg-grid-white\/10 {
		background-image:
			linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
		background-size: 40px 40px;
	}
</style>
