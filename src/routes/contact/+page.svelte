<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ArrowLeft } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let form = $state({
		name: '',
		email: '',
		company: '',
		subject: '',
		message: '',
		type: 'general'
	});

	let isSubmitting = $state(false);

	const contactMethods = [
		{
			icon: Mail,
			title: 'Email Us',
			description: 'Send us an email and we\'ll respond within 24 hours',
			value: 'hello@roster86.com',
			action: 'mailto:hello@roster86.com'
		},
		{
			icon: Phone,
			title: 'Call Us',
			description: 'Speak with our support team directly',
			value: '+1 (555) 123-4567',
			action: 'tel:+15551234567'
		},
		{
			icon: MessageCircle,
			title: 'Live Chat',
			description: 'Chat with us in real-time during business hours',
			value: 'Start Chat',
			action: '#'
		}
	];

	const officeInfo = [
		{
			icon: MapPin,
			title: 'Address',
			value: '123 Business Ave\nSuite 100\nSan Francisco, CA 94105'
		},
		{
			icon: Clock,
			title: 'Business Hours',
			value: 'Monday - Friday: 9:00 AM - 6:00 PM PST\nSaturday: 10:00 AM - 4:00 PM PST\nSunday: Closed'
		}
	];

	const inquiryTypes = [
		{ value: 'general', label: 'General Inquiry' },
		{ value: 'sales', label: 'Sales & Pricing' },
		{ value: 'support', label: 'Technical Support' },
		{ value: 'partnership', label: 'Partnership' },
		{ value: 'press', label: 'Press & Media' }
	];
</script>

<svelte:head>
	<title>Contact Us - Roster86</title>
	<meta name="description" content="Get in touch with Roster86. We're here to help with your restaurant scheduling needs." />
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
					Get in <span class="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">Touch</span>
				</h1>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Have questions about Roster86? We're here to help you streamline your restaurant scheduling.
				</p>
			</motion.div>
		</div>
	</section>

	<!-- Contact Methods -->
	<section class="py-16 bg-slate-50 dark:bg-slate-900">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-3 gap-8">
				{#each contactMethods as method, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<a 
							href={method.action}
							class="group block p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
						>
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
								<svelte:component this={method.icon} class="w-6 h-6 text-white" />
							</div>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
								{method.title}
							</h3>
							<p class="text-slate-600 dark:text-slate-400 mb-4">
								{method.description}
							</p>
							<p class="text-primary-600 dark:text-primary-400 font-medium">
								{method.value}
							</p>
						</a>
					</motion.div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Main Content -->
	<section class="py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid lg:grid-cols-2 gap-16">
				<!-- Contact Form -->
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div class="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
						<h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
							Send us a Message
						</h2>

						<form method="POST" action="?/contact" use:enhance={() => {
							isSubmitting = true;
							return async ({ result, update }) => {
								isSubmitting = false;
								if (result.type === 'success') {
									toast.success('Message sent successfully! We\'ll get back to you soon.');
									form = { name: '', email: '', company: '', subject: '', message: '', type: 'general' };
								} else if (result.type === 'failure') {
									toast.error(result.data?.error || 'Failed to send message. Please try again.');
								}
								await update();
							};
						}}>
							<div class="grid md:grid-cols-2 gap-6 mb-6">
								<Input
									name="name"
									label="Full Name"
									placeholder="John Doe"
									bind:value={form.name}
									required
								/>
								<Input
									name="email"
									type="email"
									label="Email Address"
									placeholder="john@restaurant.com"
									bind:value={form.email}
									required
								/>
							</div>

							<div class="mb-6">
								<Input
									name="company"
									label="Company/Restaurant Name"
									placeholder="Your Restaurant Name"
									bind:value={form.company}
								/>
							</div>

							<div class="mb-6">
								<label for="type" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
									Inquiry Type <span class="text-red-500">*</span>
								</label>
								<select
									name="type"
									bind:value={form.type}
									required
									class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
								>
									{#each inquiryTypes as type}
										<option value={type.value}>{type.label}</option>
									{/each}
								</select>
							</div>

							<div class="mb-6">
								<Input
									name="subject"
									label="Subject"
									placeholder="How can we help you?"
									bind:value={form.subject}
									required
								/>
							</div>

							<div class="mb-6">
								<label for="message" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
									Message <span class="text-red-500">*</span>
								</label>
								<textarea
									name="message"
									bind:value={form.message}
									required
									rows="6"
									placeholder="Tell us more about your needs..."
									class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
								></textarea>
							</div>

							<Button
								type="submit"
								variant="primary"
								size="lg"
								class="w-full"
								loading={isSubmitting}
							>
								<Send class="w-5 h-5 mr-2" />
								Send Message
							</Button>
						</form>
					</div>
				</motion.div>

				<!-- Office Information -->
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div class="space-y-8">
						<div>
							<h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
								Visit Our Office
							</h2>
							<p class="text-lg text-slate-600 dark:text-slate-400 mb-8">
								We'd love to meet you in person. Stop by our office or schedule a meeting with our team.
							</p>
						</div>

						{#each officeInfo as info, i}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
							>
								<div class="flex items-start space-x-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
									<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
										<svelte:component this={info.icon} class="w-5 h-5 text-white" />
									</div>
									<div>
										<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
											{info.title}
										</h3>
										<p class="text-slate-600 dark:text-slate-400 whitespace-pre-line">
											{info.value}
										</p>
									</div>
								</div>
							</motion.div>
						{/each}

						<!-- Map placeholder -->
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							<div class="aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
								<div class="text-center">
									<MapPin class="w-12 h-12 text-slate-400 mx-auto mb-4" />
									<p class="text-slate-500 dark:text-slate-400">Interactive map coming soon</p>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="py-24 bg-slate-50 dark:bg-slate-900">
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
					Quick answers to common questions about Roster86
				</p>
			</motion.div>

			<div class="space-y-6">
				{#each [
					{
						question: "How quickly can I get started with Roster86?",
						answer: "You can sign up and start scheduling within minutes. Our onboarding process is designed to get you up and running quickly, with optional guided setup for more complex needs."
					},
					{
						question: "Do you offer customer support?",
						answer: "Yes! We provide email support for all users, with priority support for paid plans. Enterprise customers get dedicated account management and phone support."
					},
					{
						question: "Can I import my existing schedule data?",
						answer: "Absolutely. We support importing from Excel, CSV files, and most popular scheduling platforms. Our team can help with data migration for larger organizations."
					},
					{
						question: "Is there a mobile app?",
						answer: "Yes, Roster86 works perfectly on mobile browsers and we have native iOS and Android apps coming soon. Your team can clock in, view schedules, and request time off from any device."
					},
					{
						question: "What if I need a custom feature?",
						answer: "We're always improving Roster86 based on customer feedback. Enterprise customers can request custom features and integrations. Contact our sales team to discuss your specific needs."
					}
				] as faq, i}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
					>
						<details class="group bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
							<summary class="flex items-center justify-between cursor-pointer list-none">
								<h3 class="text-lg font-semibold text-slate-900 dark:text-white">
									{faq.question}
								</h3>
								<div class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center group-open:rotate-45 transition-transform">
									<div class="w-3 h-3 text-primary-600 dark:text-primary-400">+</div>
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
</div>
