<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import Button from './Button.svelte';

	interface ChatMessage {
		id: string;
		type: 'user' | 'ai';
		content: string;
		timestamp: Date;
	}

	interface Props {
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		theme?: 'light' | 'dark' | 'auto';
		initialMessage?: string;
		onSendMessage?: (message: string) => Promise<string>;
	}

	let {
		position = 'bottom-right',
		theme = 'auto',
		initialMessage = "Hi! I'm your AI scheduling assistant. How can I help you today?",
		onSendMessage
	}: Props = $props();

	let isOpen = $state(false);
	let isLoading = $state(false);
	let messages = $state<ChatMessage[]>([]);
	let currentMessage = $state('');
	let chatContainer: HTMLElement;
	let messageInput: HTMLInputElement;

	// Initialize with welcome message
	onMount(() => {
		messages = [
			{
				id: crypto.randomUUID(),
				type: 'ai',
				content: initialMessage,
				timestamp: new Date()
			}
		];
	});

	// Position classes
	const positionClasses = {
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4'
	};

	async function sendMessage() {
		if (!currentMessage.trim() || isLoading || !onSendMessage) return;

		const userMessage: ChatMessage = {
			id: crypto.randomUUID(),
			type: 'user',
			content: currentMessage.trim(),
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		const messageToSend = currentMessage.trim();
		currentMessage = '';
		isLoading = true;

		// Scroll to bottom
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 10);

		try {
			const aiResponse = await onSendMessage(messageToSend);
			
			const aiMessage: ChatMessage = {
				id: crypto.randomUUID(),
				type: 'ai',
				content: aiResponse,
				timestamp: new Date()
			};

			messages = [...messages, aiMessage];
		} catch (error) {
			const errorMessage: ChatMessage = {
				id: crypto.randomUUID(),
				type: 'ai',
				content: 'Sorry, I encountered an error. Please try again.',
				timestamp: new Date()
			};
			messages = [...messages, errorMessage];
		} finally {
			isLoading = false;
			// Scroll to bottom after AI response
			setTimeout(() => {
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}, 10);
		}
	}

	function toggleChat() {
		isOpen = !isOpen;
		if (isOpen && messageInput) {
			setTimeout(() => messageInput.focus(), 100);
		}
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	// Convert markdown to HTML for AI messages
	function formatMessage(content: string): string {
		return marked(content);
	}
</script>

<!-- Chat Bubble Container -->
<div class="fixed {positionClasses[position]} z-50 flex flex-col items-end">
	<!-- Chat Window -->
	{#if isOpen}
		<div
			class="mb-4 w-80 h-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
			style="animation: slideUp 0.2s ease-out;"
		>
			<!-- Header -->
			<div class="bg-primary-500 text-white p-3 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
						🤖
					</div>
					<div>
						<h3 class="font-semibold text-sm">AI Assistant</h3>
						<p class="text-xs text-primary-100">Always here to help</p>
					</div>
				</div>
				<button
					onclick={toggleChat}
					class="text-white/80 hover:text-white transition-colors"
					aria-label="Close chat"
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Input Area -->
			<div class="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
				<form onsubmit={(e) => { e.preventDefault(); sendMessage(); }} class="flex gap-2">
					<input
						bind:this={messageInput}
						bind:value={currentMessage}
						type="text"
						placeholder="Ask me anything about scheduling..."
						class="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
						disabled={isLoading}
					/>
					<Button
						type="submit"
						variant="primary"
						size="sm"
						disabled={!currentMessage.trim() || isLoading}
						class="px-3"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
						</svg>
					</Button>
				</form>
			</div>
		</div>
	{/if}

	<!-- Chat Bubble Button -->
	<button
		onclick={toggleChat}
		class="w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
		aria-label="Open AI chat"
	>
		{#if isOpen}
			<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<div class="relative">
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
				<!-- Notification dot for new features -->
				<div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
			</div>
		{/if}
	</button>
</div>

<style>
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

			<!-- Messages -->
			<div
				bind:this={chatContainer}
				class="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-slate-900"
			>
				{#each messages as message (message.id)}
					<div class="flex {message.type === 'user' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[80%] rounded-lg px-3 py-2 {message.type === 'user'
								? 'bg-primary-500 text-white'
								: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600'}"
						>
							{#if message.type === 'ai'}
								<div class="prose prose-sm dark:prose-invert max-w-none">
									{@html formatMessage(message.content)}
								</div>
							{:else}
								<p class="text-sm">{message.content}</p>
							{/if}
							<p class="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
						</div>
					</div>
				{/each}

				{#if isLoading}
					<div class="flex justify-start">
						<div class="bg-white dark:bg-slate-700 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-600">
							<div class="flex items-center gap-1">
								<div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
								<div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
								<div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
							</div>
						</div>
					</div>
				{/if}
			</div>
