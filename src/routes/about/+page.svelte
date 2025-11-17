<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { ArrowLeft, Users, Target, Lightbulb, Award, Heart, Zap } from 'lucide-svelte';

	const stats = [
		{ value: '2025', label: 'Founded' },
		{ value: '1', label: 'Passionate Developer' },
		{ value: '∞', label: 'Lines of Code' },
		{ value: '24/7', label: 'Dedication' }
	];

	const values = [
		{
			icon: Heart,
			title: 'Born from Experience',
			description: 'Having managed restaurant teams firsthand, I understand the daily struggles of scheduling, staffing, and keeping everyone happy.'
		},
		{
			icon: Zap,
			title: 'Creative Problem Solving',
			description: 'My journey into photography taught me to see problems from different angles and find elegant solutions.'
		},
		{
			icon: Target,
			title: 'Real-World Focus',
			description: 'Every feature is built based on actual restaurant management experience, not theoretical assumptions.'
		},
		{
			icon: Users,
			title: 'Passion Project',
			description: 'This isn\'t just business - it\'s a personal mission to solve problems I\'ve lived through myself.'
		}
	];

	const team = [
		{
			name: 'The Solo Developer',
			role: 'Founder, Developer, Designer, Everything',
			bio: 'A restaurant manager turned photographer turned software developer. Armed with a laptop, too much coffee, and the determination to solve scheduling headaches once and for all.',
			image: '/team/founder.jpg'
		}
	];

	const milestones = [
		{
			year: 'The Past',
			title: 'Restaurant Management',
			description: 'Years of managing restaurant teams and wrestling with terrible scheduling software that made life harder than it needed to be.'
		},
		{
			year: 'The Transition',
			title: 'Photography Journey',
			description: 'Moved into photography, but never forgot the daily scheduling nightmares from restaurant management.'
		},
		{
			year: '2025',
			title: 'Discovery of Code',
			description: 'Found my love for coding and realized I could finally build the scheduling tool I always wished I had.'
		},
		{
			year: 'Now',
			title: 'The Journey Continues',
			description: 'One developer, one laptop, and an endless supply of determination to make restaurant scheduling suck less.'
		}
	];
</script>

<svelte:head>
	<title>About Us - Roster86</title>
	<meta name="description" content="Learn about Roster86's mission to revolutionize restaurant scheduling. Meet our team and discover our story." />
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
				<h1 class="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
					Our <span class="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">Story</span>
				</h1>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
					A passion project born from frustration. One restaurant-manager-turned-photographer-turned-developer on a mission to fix scheduling software that doesn't suck.
				</p>
			</motion.div>

			<!-- Stats -->
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
					{#each stats as stat, i}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 + (i * 0.1) }}
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
	</section>

	<!-- Mission Section -->
	<section class="py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid lg:grid-cols-2 gap-16 items-center">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-6">
						Why I Built Roster86
					</h2>
					<div class="space-y-6 text-lg text-slate-600 dark:text-slate-400">
						<p>
							Picture this: You're managing restaurants, dealing with scheduling software that feels like it was designed by someone who's never worked a day in food service. Spreadsheets everywhere. Staff calling in sick with no easy way to find coverage. The same headaches, every single week.
						</p>
						<p>
							After years of that grind, I transitioned into photography - but I never forgot those scheduling nightmares. When I discovered coding, I realized I could finally build the scheduling tool I always wished I had. One that actually understands how restaurants work. One that doesn't make you want to throw your laptop out the window.
						</p>
						<p>
							This is my passion project. Built by someone who's been in the trenches, for people who are still fighting the good fight every day. It's just me, my laptop, and an unhealthy amount of coffee - but hey, that's how the best things start, right?
						</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div class="aspect-square rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 p-1">
						<div class="w-full h-full rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center">
							<div class="text-center p-8">
								<Lightbulb class="w-24 h-24 text-primary-500 mx-auto mb-6" />
								<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
									Innovation Meets Experience
								</h3>
								<p class="text-slate-600 dark:text-slate-400">
									Combining restaurant industry expertise with cutting-edge technology to solve real problems.
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	</section>

	<!-- Values Section -->
	<section class="py-24 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					My Values
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					The principles that guide everything I build into Roster86
				</p>
			</motion.div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each values as value, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<div class="text-center p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
							<div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
								<svelte:component this={value.icon} class="w-8 h-8 text-white" />
							</div>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
								{value.title}
							</h3>
							<p class="text-slate-600 dark:text-slate-400">
								{value.description}
							</p>
						</div>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Team Section -->
	<section class="py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					Meet the Team
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Spoiler alert: It's just me. But hey, I'm pretty passionate about making restaurant scheduling better!
				</p>
			</motion.div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each team as member, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<div class="text-center group">
							<div class="relative mb-6">
								<div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mx-auto p-1">
									<div class="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
										<!-- Placeholder for team member photo -->
										<Users class="w-16 h-16 text-slate-400" />
									</div>
								</div>
							</div>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
								{member.name}
							</h3>
							<p class="text-primary-600 dark:text-primary-400 font-medium mb-4">
								{member.role}
							</p>
							<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
								{member.bio}
							</p>
						</div>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Timeline Section -->
	<section class="py-24 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				class="text-center mb-16"
			>
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
					My Journey
				</h2>
				<p class="text-xl text-slate-600 dark:text-slate-400">
					From camera to kitchen to code - the Roster86 origin story
				</p>
			</motion.div>

			<div class="relative">
				<!-- Timeline line -->
				<div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-purple-600"></div>

				<div class="space-y-12">
					{#each milestones as milestone, i}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: i * 0.1 }}
						>
							<div class="relative flex items-start">
								<!-- Timeline dot -->
								<div class="absolute left-6 w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 border-4 border-white dark:border-slate-950"></div>

								<!-- Content -->
								<div class="ml-20">
									<div class="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
										<div class="flex items-center space-x-4 mb-3">
											<span class="text-2xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
												{milestone.year}
											</span>
											<h3 class="text-xl font-bold text-slate-900 dark:text-white">
												{milestone.title}
											</h3>
										</div>
										<p class="text-slate-600 dark:text-slate-400">
											{milestone.description}
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					{/each}
				</div>
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
					Join the Journey
				</h2>
				<p class="text-xl text-white/90 mb-8">
					Ready to try scheduling software that doesn't make you want to scream? Let's fix this together, one restaurant at a time.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/auth/signup"
						class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-white text-primary-600 hover:bg-slate-100 transition-colors"
					>
						Start Free Trial
					</a>
					<a
						href="/contact"
						class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
					>
						Say Hello
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
