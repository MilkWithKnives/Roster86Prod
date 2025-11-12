<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let email = $state(form?.email || '');
	let loading = $state(false);

	function handleSubmit(e: SubmitEvent) {
		loading = true;
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
	<div class="w-full max-w-md">
		<!-- Logo/Brand -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">
				<span class="text-primary-500">SvelteRoster</span>
			</h1>
			<p class="text-slate-600 dark:text-slate-400">Reset your password</p>
		</div>

		<!-- Forgot Password Card -->
		<div class="card p-8">
			<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Forgot password?</h2>
			<p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
				No worries! Enter your email and we'll send you a reset link.
			</p>

			{#if form?.error}
				<div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<p class="text-sm text-red-600 dark:text-red-400">{form.error}</p>
				</div>
			{/if}

			<form method="POST" onsubmit={handleSubmit} class="space-y-4">
				<div>
					<Input
						type="email"
						name="email"
						label="Email"
						placeholder="Enter your email address"
						bind:value={email}
						required
						autocomplete="email"
					/>
				</div>

				<div class="pt-2">
					<Button type="submit" variant="primary" {loading} class="w-full">
						{loading ? 'Sending...' : 'Send Reset Link'}
					</Button>
				</div>
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-slate-600 dark:text-slate-400">
					Remember your password?
					<a href="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
						Back to login
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
