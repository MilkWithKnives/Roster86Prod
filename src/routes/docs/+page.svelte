<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { ArrowLeft, Book, Code, Zap, Database, Shield, Smartphone, ChevronRight, ExternalLink } from 'lucide-svelte';

	const sections = [
		{
			icon: Book,
			title: 'Getting Started',
			description: 'Quick start guide and basic concepts',
			items: [
				'Installation & Setup',
				'Authentication',
				'Your First API Call',
				'Rate Limits & Best Practices'
			],
			color: 'from-blue-500 to-blue-600'
		},
		{
			icon: Code,
			title: 'API Reference',
			description: 'Complete API documentation',
			items: [
				'Schedules API',
				'Employees API',
				'Time Tracking API',
				'Webhooks'
			],
			color: 'from-green-500 to-green-600'
		},
		{
			icon: Zap,
			title: 'Integrations',
			description: 'Connect with third-party services',
			items: [
				'Slack Integration',
				'QuickBooks Sync',
				'POS System Connectors',
				'Custom Webhooks'
			],
			color: 'from-purple-500 to-purple-600'
		},
		{
			icon: Smartphone,
			title: 'Mobile SDKs',
			description: 'Native mobile development',
			items: [
				'iOS SDK',
				'Android SDK',
				'React Native',
				'Flutter Plugin'
			],
			color: 'from-orange-500 to-orange-600'
		},
		{
			icon: Database,
			title: 'Data Export',
			description: 'Export and backup your data',
			items: [
				'CSV Export',
				'JSON API',
				'Bulk Operations',
				'Data Migration'
			],
			color: 'from-pink-500 to-pink-600'
		},
		{
			icon: Shield,
			title: 'Security',
			description: 'Security best practices',
			items: [
				'API Authentication',
				'OAuth 2.0 Flow',
				'Security Headers',
				'Compliance'
			],
			color: 'from-red-500 to-red-600'
		}
	];

	const quickLinks = [
		{
			title: 'API Playground',
			description: 'Test API endpoints interactively',
			url: '/docs/playground',
			external: false
		},
		{
			title: 'Postman Collection',
			description: 'Import our API collection',
			url: 'https://postman.com/roster86',
			external: true
		},
		{
			title: 'GitHub Repository',
			description: 'View code examples and SDKs',
			url: 'https://github.com/roster86',
			external: true
		},
		{
			title: 'Status Page',
			description: 'Check API status and uptime',
			url: 'https://status.roster86.com',
			external: true
		}
	];

	const codeExamples = [
		{
			title: 'Create a Schedule',
			language: 'JavaScript',
			code: `const response = await fetch('/api/schedules', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Week of Jan 15',
    startDate: '2025-01-15',
    endDate: '2025-01-21',
    locationId: 'loc_123'
  })
});

const schedule = await response.json();`
		},
		{
			title: 'Get Employee Shifts',
			language: 'Python',
			code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.roster86.com/v1/employees/emp_123/shifts',
    headers=headers,
    params={
        'start_date': '2025-01-15',
        'end_date': '2025-01-21'
    }
)

shifts = response.json()`
		},
		{
			title: 'Clock In/Out',
			language: 'cURL',
			code: `curl -X POST https://api.roster86.com/v1/time-clock/punch \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "employeeId": "emp_123",
    "action": "clock_in",
    "timestamp": "2025-01-15T09:00:00Z",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  }'`
		}
	];
</script>

<svelte:head>
	<title>Documentation - Roster86</title>
	<meta name="description" content="Complete documentation for Roster86 API, integrations, and developer tools." />
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
					<Book class="w-10 h-10 text-white" />
				</div>
				<h1 class="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
					Developer <span class="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">Docs</span>
				</h1>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
					Everything you need to integrate with Roster86. APIs, SDKs, webhooks, and more.
				</p>

				<!-- Version Badge -->
				<div class="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-medium">
					API Version 1.0 • Last updated Jan 2025
				</div>
			</motion.div>
		</div>
	</section>

	<!-- Quick Links -->
	<section class="py-16 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each quickLinks as link, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<a
							href={link.url}
							{...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
							class="group block p-6 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
						>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
									{link.title}
								</h3>
								{#if link.external}
									<ExternalLink class="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
								{:else}
									<ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
								{/if}
							</div>
							<p class="text-sm text-slate-600 dark:text-slate-400">
								{link.description}
							</p>
						</a>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Documentation Sections -->
	<section class="py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					Documentation Sections
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400">
					Comprehensive guides and references for developers
				</p>
			</motion.div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each sections as section, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<div class="group p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
							<div class="w-16 h-16 rounded-2xl bg-gradient-to-br {section.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
								<svelte:component this={section.icon} class="w-8 h-8 text-white" />
							</div>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">
								{section.title}
							</h3>
							<p class="text-slate-600 dark:text-slate-400 mb-6">
								{section.description}
							</p>
							<ul class="space-y-2">
								{#each section.items as item}
									<li class="flex items-center text-sm text-slate-600 dark:text-slate-400">
										<ChevronRight class="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" />
										{item}
									</li>
								{/each}
							</ul>
						</div>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Code Examples -->
	<section class="py-24 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					Code Examples
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400">
					Get started quickly with these code snippets
				</p>
			</motion.div>

			<div class="space-y-8">
				{#each codeExamples as example, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.2 }}
					>
						<div class="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
							<div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
								<h3 class="text-lg font-semibold text-slate-900 dark:text-white">
									{example.title}
								</h3>
								<span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
									{example.language}
								</span>
							</div>
							<div class="p-6">
								<pre class="text-sm text-slate-800 dark:text-slate-200 overflow-x-auto"><code>{example.code}</code></pre>
							</div>
						</div>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Getting Started CTA -->
	<section class="py-24 bg-gradient-to-br from-primary-500 to-purple-600 relative overflow-hidden">
		<div class="absolute inset-0 bg-grid-white/10"></div>

		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Ready to Build?
				</h2>
				<p class="text-xl text-white/90 mb-8">
					Get your API key and start integrating with Roster86 today.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/auth/signup"
						class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-white text-primary-600 hover:bg-slate-100 transition-colors"
					>
						Get API Key
					</a>
					<a
						href="/docs/getting-started"
						class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
					>
						View Quick Start
					</a>
				</div>
			</div>
		</motion.div>
	</section>

	<!-- Support Section -->
	<section class="py-16 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
					Need Help?
				</h3>
				<p class="text-slate-600 dark:text-slate-400 mb-8">
					Our developer support team is here to help you succeed.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/contact"
						class="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
					>
						Contact Support
					</a>
					<a
						href="https://github.com/roster86/examples"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
					>
						<Code class="w-4 h-4 mr-2" />
						View Examples
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.bg-grid-white\/10 {
		background-image:
			linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
		background-size: 40px 40px;
	}

	pre {
		background: #1e293b;
		color: #e2e8f0;
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
	}

	:global(.dark) pre {
		background: #0f172a;
		color: #cbd5e1;
	}
</style>
