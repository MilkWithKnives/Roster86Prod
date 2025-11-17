<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { ArrowLeft, Search, Book, Users, Calendar, Clock, Settings, MessageCircle, ChevronRight, HelpCircle } from 'lucide-svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	let searchQuery = $state('');

	const categories = [
		{
			icon: Calendar,
			title: 'Getting Started',
			description: 'Learn the basics of Roster86',
			articles: 12,
			color: 'from-blue-500 to-blue-600'
		},
		{
			icon: Users,
			title: 'Team Management',
			description: 'Managing employees and roles',
			articles: 8,
			color: 'from-green-500 to-green-600'
		},
		{
			icon: Clock,
			title: 'Scheduling',
			description: 'Creating and managing schedules',
			articles: 15,
			color: 'from-purple-500 to-purple-600'
		},
		{
			icon: Settings,
			title: 'Account Settings',
			description: 'Customize your account and preferences',
			articles: 6,
			color: 'from-orange-500 to-orange-600'
		},
		{
			icon: MessageCircle,
			title: 'Integrations',
			description: 'Connect with other tools and services',
			articles: 4,
			color: 'from-pink-500 to-pink-600'
		},
		{
			icon: HelpCircle,
			title: 'Troubleshooting',
			description: 'Common issues and solutions',
			articles: 10,
			color: 'from-red-500 to-red-600'
		}
	];

	const popularArticles = [
		{
			title: 'How to create your first schedule',
			category: 'Getting Started',
			readTime: '5 min read'
		},
		{
			title: 'Adding and managing team members',
			category: 'Team Management',
			readTime: '3 min read'
		},
		{
			title: 'Setting up automatic scheduling',
			category: 'Scheduling',
			readTime: '7 min read'
		},
		{
			title: 'Understanding time-off requests',
			category: 'Scheduling',
			readTime: '4 min read'
		},
		{
			title: 'Configuring notification settings',
			category: 'Account Settings',
			readTime: '2 min read'
		}
	];

	const quickActions = [
		{
			title: 'Contact Support',
			description: 'Get help from our support team',
			action: '/contact',
			icon: MessageCircle
		},
		{
			title: 'Video Tutorials',
			description: 'Watch step-by-step guides',
			action: '#',
			icon: Book
		},
		{
			title: 'Community Forum',
			description: 'Connect with other users',
			action: '#',
			icon: Users
		}
	];

	const faqs = [
		{
			question: 'How do I reset my password?',
			answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. We\'ll send you an email with instructions to create a new password.'
		},
		{
			question: 'Can I import my existing schedule data?',
			answer: 'Yes! Roster86 supports importing schedules from Excel files, CSV files, and most popular scheduling platforms. Contact our support team for help with data migration.'
		},
		{
			question: 'How many employees can I add to my account?',
			answer: 'This depends on your plan. The Starter plan supports up to 10 employees, Professional supports up to 50, and Enterprise supports unlimited employees.'
		},
		{
			question: 'Is there a mobile app?',
			answer: 'Roster86 works great on mobile browsers, and we have native iOS and Android apps coming soon. Your team can access schedules, clock in/out, and request time off from any device.'
		},
		{
			question: 'How does the AI scheduling work?',
			answer: 'Our AI considers employee availability, labor costs, historical data, and business rules to create optimized schedules. It learns from your preferences and gets better over time.'
		}
	];
</script>

<svelte:head>
	<title>Help Center - Roster86</title>
	<meta name="description" content="Find answers to your questions about Roster86. Browse our help articles, tutorials, and FAQs." />
</svelte:head>

<div class="min-h-screen bg-white dark:bg-slate-950">
	<!-- Navigation -->
	<nav class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
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

				<div class="flex items-center space-x-4">
					<a href="/" class="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
						<ArrowLeft class="w-4 h-4" />
						<span>Back to Home</span>
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative overflow-hidden py-24">
		<div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 opacity-50"></div>
		
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center"
			>
				<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-8">
					<HelpCircle class="w-10 h-10 text-white" />
				</div>
				<h1 class="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
					Help <span class="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">Center</span>
				</h1>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
					Find answers to your questions and learn how to get the most out of Roster86
				</p>

				<!-- Search Bar -->
				<div class="max-w-2xl mx-auto">
					<div class="relative">
						<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
						<input
							type="text"
							placeholder="Search for help articles..."
							bind:value={searchQuery}
							class="w-full pl-12 pr-4 py-4 text-lg border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
					</div>
				</div>
			</motion.div>
		</div>
	</section>

	<!-- Quick Actions -->
	<section class="py-16 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-3 gap-8">
				{#each quickActions as action, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<a
							href={action.action}
							class="group block p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
						>
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
								<svelte:component this={action.icon} class="w-6 h-6 text-white" />
							</div>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
								{action.title}
							</h3>
							<p class="text-slate-600 dark:text-slate-400">
								{action.description}
							</p>
						</a>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Categories -->
	<section class="py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					Browse by Category
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400">
					Find help articles organized by topic
				</p>
			</motion.div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each categories as category, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<a
							href="/help/category/{category.title.toLowerCase().replace(/\s+/g, '-')}"
							class="group block p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
						>
							<div class="w-16 h-16 rounded-2xl bg-gradient-to-br {category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
								<svelte:component this={category.icon} class="w-8 h-8 text-white" />
							</div>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
								{category.title}
							</h3>
							<p class="text-slate-600 dark:text-slate-400 mb-4">
								{category.description}
							</p>
							<div class="flex items-center justify-between">
								<span class="text-sm text-slate-500 dark:text-slate-500">
									{category.articles} articles
								</span>
								<ChevronRight class="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
							</div>
						</a>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Popular Articles -->
	<section class="py-24 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					Popular Articles
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400">
					Most viewed help articles this month
				</p>
			</motion.div>

			<div class="space-y-4">
				{#each popularArticles as article, i}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<a
							href="/help/article/{article.title.toLowerCase().replace(/\s+/g, '-')}"
							class="group flex items-center justify-between p-6 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300"
						>
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
									{article.title}
								</h3>
								<div class="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
									<span>{article.category}</span>
									<span>•</span>
									<span>{article.readTime}</span>
								</div>
							</div>
							<ChevronRight class="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
						</a>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="py-24">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					Frequently Asked Questions
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400">
					Quick answers to common questions
				</p>
			</motion.div>

			<div class="space-y-6">
				{#each faqs as faq, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<details class="group bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
							<summary class="flex items-center justify-between cursor-pointer list-none">
								<h3 class="text-lg font-semibold text-slate-900 dark:text-white pr-4">
									{faq.question}
								</h3>
								<div class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center group-open:rotate-45 transition-transform flex-shrink-0">
									<div class="w-3 h-3 text-primary-600 dark:text-primary-400 text-lg leading-none">+</div>
								</div>
							</summary>
							<div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
								<p class="text-slate-600 dark:text-slate-400 leading-relaxed">
									{faq.answer}
								</p>
							</div>
						</details>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact Support CTA -->
	<section class="py-24 bg-gradient-to-br from-primary-500 to-purple-600 relative overflow-hidden">
		<div class="absolute inset-0 bg-grid-white/10"></div>

		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Still Need Help?
				</h2>
				<p class="text-xl text-white/90 mb-8">
					Can't find what you're looking for? Our support team is here to help.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/contact"
						class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-white text-primary-600 hover:bg-slate-100 transition-colors"
					>
						<MessageCircle class="w-5 h-5 mr-2" />
						Contact Support
					</a>
					<a
						href="mailto:support@roster86.com"
						class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
					>
						Email Us
					</a>
				</div>
			</div>
		</motion.div>
	</section>
</div>

<style>
	.bg-grid-white\/10 {
		background-image:
			linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
		background-size: 40px 40px;
	}
</style>
