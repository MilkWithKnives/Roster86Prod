<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { ArrowLeft, Shield, Eye, Lock, Database, Users, FileText } from 'lucide-svelte';

	const sections = [
		{
			id: 'information-collection',
			title: 'Information We Collect',
			icon: Database
		},
		{
			id: 'information-use',
			title: 'How We Use Your Information',
			icon: Eye
		},
		{
			id: 'information-sharing',
			title: 'Information Sharing',
			icon: Users
		},
		{
			id: 'data-security',
			title: 'Data Security',
			icon: Lock
		},
		{
			id: 'your-rights',
			title: 'Your Rights',
			icon: Shield
		},
		{
			id: 'contact',
			title: 'Contact Us',
			icon: FileText
		}
	];
</script>

<svelte:head>
	<title>Privacy Policy - Roster86</title>
	<meta name="description" content="Roster86's Privacy Policy. Learn how we collect, use, and protect your personal information." />
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
					<Shield class="w-10 h-10 text-white" />
				</div>
				<h1 class="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
					Privacy <span class="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">Policy</span>
				</h1>
				<p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
					Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
				</p>
				<p class="text-sm text-slate-500 dark:text-slate-500">
					Last updated: January 15, 2025
				</p>
			</motion.div>
		</div>
	</section>

	<!-- Main Content -->
	<section class="py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid lg:grid-cols-4 gap-12">
				<!-- Table of Contents -->
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					class="lg:col-span-1"
				>
					<div class="sticky top-24">
						<h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">
							Table of Contents
						</h2>
						<nav class="space-y-2">
							{#each sections as section, i}
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: i * 0.1 }}
								>
									<a
										href="#{section.id}"
										class="flex items-center space-x-3 p-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
									>
										<svelte:component this={section.icon} class="w-4 h-4" />
										<span class="text-sm">{section.title}</span>
									</a>
								</motion.div>
							{/each}
						</nav>
					</div>
				</motion.div>

				<!-- Content -->
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					class="lg:col-span-3"
				>
					<div class="prose prose-slate dark:prose-invert max-w-none">
						<div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-12">
							<h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
								Quick Summary
							</h3>
							<p class="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
								We collect information necessary to provide our scheduling services, use it to improve your experience, 
								and never sell your personal data to third parties. You have full control over your information and 
								can request its deletion at any time.
							</p>
						</div>

						<!-- Information Collection -->
						<section id="information-collection" class="mb-12">
							<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
								<Database class="w-6 h-6 mr-3 text-primary-500" />
								Information We Collect
							</h2>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h3>
							<p class="mb-4">When you create an account or use our services, we may collect:</p>
							<ul class="list-disc pl-6 mb-6 space-y-2">
								<li>Name, email address, and phone number</li>
								<li>Company/restaurant information</li>
								<li>Job title and role within your organization</li>
								<li>Profile photo (optional)</li>
							</ul>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Usage Information</h3>
							<p class="mb-4">We automatically collect information about how you use our service:</p>
							<ul class="list-disc pl-6 mb-6 space-y-2">
								<li>Log data (IP address, browser type, pages visited)</li>
								<li>Device information (device type, operating system)</li>
								<li>Usage patterns and feature interactions</li>
								<li>Performance and error data</li>
							</ul>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Scheduling Data</h3>
							<p class="mb-4">To provide our core scheduling functionality, we collect:</p>
							<ul class="list-disc pl-6 mb-6 space-y-2">
								<li>Employee schedules and shift information</li>
								<li>Availability preferences and time-off requests</li>
								<li>Location and department assignments</li>
								<li>Time clock data (when using our time tracking features)</li>
							</ul>
						</section>

						<!-- Information Use -->
						<section id="information-use" class="mb-12">
							<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
								<Eye class="w-6 h-6 mr-3 text-primary-500" />
								How We Use Your Information
							</h2>

							<p class="mb-4">We use the information we collect to:</p>
							<ul class="list-disc pl-6 mb-6 space-y-2">
								<li><strong>Provide our services:</strong> Create schedules, manage shifts, track time, and facilitate team communication</li>
								<li><strong>Improve our platform:</strong> Analyze usage patterns to enhance features and user experience</li>
								<li><strong>Customer support:</strong> Respond to your questions and provide technical assistance</li>
								<li><strong>Security:</strong> Protect against fraud, abuse, and security threats</li>
								<li><strong>Legal compliance:</strong> Meet our legal obligations and enforce our terms of service</li>
								<li><strong>Communications:</strong> Send important updates, security alerts, and (with your consent) marketing communications</li>
							</ul>
						</section>

						<!-- Information Sharing -->
						<section id="information-sharing" class="mb-12">
							<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
								<Users class="w-6 h-6 mr-3 text-primary-500" />
								Information Sharing
							</h2>

							<p class="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:</p>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Within Your Organization</h3>
							<p class="mb-4">Your scheduling and profile information is shared with authorized users in your organization (managers, administrators) as necessary for scheduling operations.</p>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Service Providers</h3>
							<p class="mb-4">We work with trusted third-party service providers who help us operate our platform:</p>
							<ul class="list-disc pl-6 mb-6 space-y-2">
								<li>Cloud hosting providers (for data storage and processing)</li>
								<li>Email service providers (for notifications and communications)</li>
								<li>Analytics providers (for usage insights and improvements)</li>
								<li>Payment processors (for billing and subscription management)</li>
							</ul>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Legal Requirements</h3>
							<p class="mb-6">We may disclose your information if required by law, court order, or government request, or to protect our rights and the safety of our users.</p>
						</section>

						<!-- Data Security -->
						<section id="data-security" class="mb-12">
							<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
								<Lock class="w-6 h-6 mr-3 text-primary-500" />
								Data Security
							</h2>

							<p class="mb-4">We take the security of your information seriously and implement multiple layers of protection:</p>
							<ul class="list-disc pl-6 mb-6 space-y-2">
								<li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
								<li><strong>Access controls:</strong> Strict access controls ensure only authorized personnel can access your data</li>
								<li><strong>Regular audits:</strong> We conduct regular security audits and vulnerability assessments</li>
								<li><strong>Secure infrastructure:</strong> Our platform is hosted on secure, SOC 2 compliant cloud infrastructure</li>
								<li><strong>Employee training:</strong> All employees receive security training and sign confidentiality agreements</li>
							</ul>

							<div class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
								<p class="text-amber-800 dark:text-amber-200 text-sm">
									<strong>Important:</strong> While we implement strong security measures, no system is 100% secure.
									We encourage you to use strong passwords and keep your login credentials confidential.
								</p>
							</div>
						</section>

						<!-- Your Rights -->
						<section id="your-rights" class="mb-12">
							<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
								<Shield class="w-6 h-6 mr-3 text-primary-500" />
								Your Rights
							</h2>

							<p class="mb-4">You have several rights regarding your personal information:</p>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Access and Portability</h3>
							<p class="mb-4">You can access and download your personal information at any time through your account settings or by contacting us.</p>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Correction</h3>
							<p class="mb-4">You can update your personal information directly in your account settings. If you need help, contact our support team.</p>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Deletion</h3>
							<p class="mb-4">You can request deletion of your account and personal information. Note that we may retain certain information for legal or business purposes as permitted by law.</p>

							<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Marketing Communications</h3>
							<p class="mb-6">You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or updating your preferences in your account settings.</p>

							<div class="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
								<p class="text-green-800 dark:text-green-200 text-sm">
									<strong>GDPR & CCPA Compliance:</strong> If you're located in the EU or California, you have additional rights under GDPR and CCPA.
									Contact us to exercise these rights or learn more about our compliance measures.
								</p>
							</div>
						</section>

						<!-- Contact -->
						<section id="contact" class="mb-12">
							<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
								<FileText class="w-6 h-6 mr-3 text-primary-500" />
								Contact Us
							</h2>

							<p class="mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>

							<div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6">
								<div class="space-y-3">
									<div>
										<strong class="text-slate-900 dark:text-white">Email:</strong>
										<a href="mailto:privacy@roster86.com" class="text-primary-600 dark:text-primary-400 hover:underline ml-2">
											privacy@roster86.com
										</a>
									</div>
									<div>
										<strong class="text-slate-900 dark:text-white">Mail:</strong>
										<span class="text-slate-600 dark:text-slate-400 ml-2">
											Roster86 Privacy Team<br>
											123 Business Ave, Suite 100<br>
											San Francisco, CA 94105
										</span>
									</div>
									<div>
										<strong class="text-slate-900 dark:text-white">Response Time:</strong>
										<span class="text-slate-600 dark:text-slate-400 ml-2">
											We typically respond to privacy inquiries within 30 days
										</span>
									</div>
								</div>
							</div>
						</section>

						<!-- Updates -->
						<section class="mb-12">
							<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
								Policy Updates
							</h2>

							<p class="mb-4">
								We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
								When we make significant changes, we will:
							</p>
							<ul class="list-disc pl-6 mb-6 space-y-2">
								<li>Update the "Last updated" date at the top of this policy</li>
								<li>Notify you via email if you have an account with us</li>
								<li>Post a notice on our website and in our application</li>
								<li>For material changes, provide at least 30 days notice before they take effect</li>
							</ul>

							<p class="text-slate-600 dark:text-slate-400">
								Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
							</p>
						</section>
					</div>
				</motion.div>
			</div>
		</div>
	</section>
</div>
