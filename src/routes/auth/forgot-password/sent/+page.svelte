<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';

	const email = $page.url.searchParams.get('email') || '';
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
	<div class="w-full max-w-md">
		<!-- Logo/Brand -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">
				<span class="text-primary-500">SvelteRoster</span>
			</h1>
		</div>

		<!-- Success Card -->
		<div class="card p-8 text-center">
			<div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
				</svg>
			</div>

			<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
			<p class="text-slate-600 dark:text-slate-400 mb-6">
				We've sent a password reset link to:
				<br>
				<strong class="text-slate-900 dark:text-white">{email}</strong>
			</p>

			<div class="space-y-4">
				<p class="text-sm text-slate-500 dark:text-slate-400">
					Didn't receive the email? Check your spam folder or try again.
				</p>

				<div class="flex flex-col sm:flex-row gap-3">
					<Button variant="outline" href="/auth/forgot-password" class="flex-1">
						Try Again
					</Button>
					<Button variant="primary" href="/auth/login" class="flex-1">
						Back to Login
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
