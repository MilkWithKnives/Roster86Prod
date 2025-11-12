<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let passwordError = $state('');

	function validatePasswords() {
		if (password && confirmPassword && password !== confirmPassword) {
			passwordError = 'Passwords do not match';
		} else {
			passwordError = '';
		}
	}

	function handleSubmit(e: SubmitEvent) {
		validatePasswords();
		if (passwordError) {
			e.preventDefault();
			return;
		}
		loading = true;
	}

	$effect(() => {
		validatePasswords();
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
	<div class="w-full max-w-md">
		<!-- Logo/Brand -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">
				<span class="text-primary-500">SvelteRoster</span>
			</h1>
			<p class="text-slate-600 dark:text-slate-400">Set your new password</p>
		</div>

		<!-- Reset Password Card -->
		<div class="card p-8">
			<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset password</h2>
			<p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
				Enter a new password for <strong>{data.email}</strong>
			</p>

			{#if form?.error}
				<div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<p class="text-sm text-red-600 dark:text-red-400">{form.error}</p>
				</div>
			{/if}

			<form method="POST" onsubmit={handleSubmit} class="space-y-4">
				<input type="hidden" name="token" value={data.token} />

				<div>
					<Input
						type="password"
						name="password"
						label="New Password"
						placeholder="Enter new password"
						bind:value={password}
						required
						autocomplete="new-password"
					/>
					<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
						Must be at least 8 characters
					</p>
				</div>

				<div>
					<Input
						type="password"
						name="confirmPassword"
						label="Confirm Password"
						placeholder="Confirm new password"
						bind:value={confirmPassword}
						required
						autocomplete="new-password"
					/>
					{#if passwordError}
						<p class="mt-1 text-xs text-red-600 dark:text-red-400">{passwordError}</p>
					{/if}
				</div>

				<div class="pt-2">
					<Button type="submit" variant="primary" {loading} disabled={!!passwordError} class="w-full">
						{loading ? 'Updating...' : 'Update Password'}
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
