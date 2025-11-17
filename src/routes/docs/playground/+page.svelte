<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { ArrowLeft, Play, Copy, Check, Code, Send, Eye, EyeOff } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';

	let selectedEndpoint = $state('GET /api/users');
	let requestBody = $state('');
	let response = $state('');
	let loading = $state(false);
	let copied = $state(false);
	let showResponse = $state(false);
	let authToken = $state('');
	let showToken = $state(false);

	const endpoints = [
		{
			method: 'GET',
			path: '/api/users',
			description: 'Get all users in organization',
			requiresAuth: true,
			sampleResponse: `{
  "users": [
    {
      "id": "user_123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "EMPLOYEE",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1
}`
		},
		{
			method: 'GET',
			path: '/api/shifts',
			description: 'Get shifts for organization',
			requiresAuth: true,
			sampleResponse: `{
  "shifts": [
    {
      "id": "shift_456",
      "startTime": "2025-01-16T09:00:00Z",
      "endTime": "2025-01-16T17:00:00Z",
      "locationId": "loc_789",
      "userId": "user_123",
      "status": "PUBLISHED"
    }
  ],
  "total": 1
}`
		},
		{
			method: 'POST',
			path: '/api/shifts',
			description: 'Create a new shift',
			requiresAuth: true,
			sampleBody: `{
  "startTime": "2025-01-16T09:00:00Z",
  "endTime": "2025-01-16T17:00:00Z",
  "locationId": "loc_789",
  "userId": "user_123"
}`,
			sampleResponse: `{
  "id": "shift_456",
  "startTime": "2025-01-16T09:00:00Z",
  "endTime": "2025-01-16T17:00:00Z",
  "locationId": "loc_789",
  "userId": "user_123",
  "status": "DRAFT",
  "createdAt": "2025-01-15T10:00:00Z"
}`
		}
	];

	const selectedEndpointData = $derived(
		endpoints.find(e => `${e.method} ${e.path}` === selectedEndpoint) || endpoints[0]
	);

	async function executeRequest() {
		loading = true;
		showResponse = true;
		
		try {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Use sample response for demo
			response = selectedEndpointData.sampleResponse || '{"message": "Success"}';
		} catch (error) {
			response = `{"error": "Request failed: ${error}"}`;
		} finally {
			loading = false;
		}
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Set sample body when endpoint changes
	$effect(() => {
		if (selectedEndpointData.sampleBody) {
			requestBody = selectedEndpointData.sampleBody;
		} else {
			requestBody = '';
		}
	});
</script>

<svelte:head>
	<title>API Playground - Roster86</title>
	<meta name="description" content="Test Roster86 API endpoints interactively with our API playground." />
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
					<a href="/docs" class="flex items-center space-x-3">
						<img src="/logo.svg" alt="Roster86" class="w-10 h-10" />
						<span class="text-xl font-bold text-slate-900 dark:text-white">
							API Playground
						</span>
					</a>
				</motion.div>

				<div class="flex items-center space-x-4">
					<a href="/docs" class="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
						<ArrowLeft class="w-4 h-4" />
						<span>Back to Docs</span>
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">
					API Playground
				</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Test our API endpoints interactively. Select an endpoint, configure your request, and see the response.
				</p>
			</div>

			<div class="grid lg:grid-cols-2 gap-8">
				<!-- Request Panel -->
				<div class="space-y-6">
					<div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
						<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
							<Send class="w-5 h-5 mr-2" />
							Request
						</h2>

						<!-- Endpoint Selection -->
						<div class="mb-4">
							<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Endpoint
							</label>
							<select 
								bind:value={selectedEndpoint}
								class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
							>
								{#each endpoints as endpoint}
									<option value="{endpoint.method} {endpoint.path}">
										{endpoint.method} {endpoint.path}
									</option>
								{/each}
							</select>
							<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
								{selectedEndpointData.description}
							</p>
						</div>

						<!-- Auth Token -->
						{#if selectedEndpointData.requiresAuth}
							<div class="mb-4">
								<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Authorization Token
								</label>
								<div class="relative">
									<input
										type={showToken ? 'text' : 'password'}
										bind:value={authToken}
										placeholder="Enter your API token..."
										class="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
									/>
									<button
										type="button"
										onclick={() => showToken = !showToken}
										class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
									>
										{#if showToken}
											<EyeOff class="w-4 h-4" />
										{:else}
											<Eye class="w-4 h-4" />
										{/if}
									</button>
								</div>
							</div>
						{/if}

						<!-- Request Body -->
					{#if selectedEndpointData.method !== 'GET'}
						<div class="mb-4">
							<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Request Body (JSON)
							</label>
							<textarea
								bind:value={requestBody}
								rows="8"
								placeholder="Enter JSON request body..."
								class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
							></textarea>
						</div>
					{/if}

					<!-- Execute Button -->
					<Button
						variant="primary"
						onclick={executeRequest}
						disabled={loading || (selectedEndpointData.requiresAuth && !authToken)}
						class="w-full"
					>
						{#if loading}
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
							Executing...
						{:else}
							<Play class="w-4 h-4 mr-2" />
							Execute Request
						{/if}
					</Button>
				</div>
			</div>

			<!-- Response Panel -->
			<div class="space-y-6">
						<div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
									<Code class="w-5 h-5 mr-2" />
									Response
								</h2>
								{#if response}
									<button
										onclick={() => copyToClipboard(response)}
										class="flex items-center space-x-2 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
									>
										{#if copied}
											<Check class="w-4 h-4 text-green-500" />
											<span class="text-green-500">Copied!</span>
										{:else}
											<Copy class="w-4 h-4" />
											<span>Copy</span>
										{/if}
									</button>
								{/if}
							</div>

							{#if showResponse}
								<div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 min-h-[300px]">
									{#if loading}
										<div class="flex items-center justify-center h-64">
											<div class="text-center">
												<div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
												<p class="text-slate-600 dark:text-slate-400">Executing request...</p>
											</div>
										</div>
									{:else if response}
										<pre class="text-sm text-slate-900 dark:text-white font-mono whitespace-pre-wrap overflow-x-auto">{response}</pre>
									{/if}
								</div>
							{:else}
								<div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
									<div class="text-center">
										<Code class="w-12 h-12 text-slate-400 mx-auto mb-4" />
										<p class="text-slate-600 dark:text-slate-400">
											Execute a request to see the response here
										</p>
									</div>
								</div>
							{/if}
						</div>

						<!-- Sample Response -->
						<div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
							<h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
								Sample Response
							</h3>
							<pre class="text-sm text-blue-800 dark:text-blue-200 font-mono whitespace-pre-wrap overflow-x-auto">{selectedEndpointData.sampleResponse}</pre>
						</div>
					</div>
				</div>

				<!-- API Documentation Link -->
				<div class="mt-12 text-center">
					<div class="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/20 dark:to-purple-950/20 rounded-xl p-8">
						<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
							Need More Information?
						</h3>
						<p class="text-slate-600 dark:text-slate-400 mb-6">
							Check out our comprehensive API documentation for detailed information about all endpoints, authentication, and examples.
						</p>
						<Button variant="primary" onclick={() => window.location.href = '/docs'}>
							View Full Documentation
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	</div>
