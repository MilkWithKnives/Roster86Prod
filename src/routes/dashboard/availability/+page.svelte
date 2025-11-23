<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	// Common time slots for restaurant workers
	const timeSlots = [
		{ label: 'Early Morning', start: '06:00', end: '12:00' },
		{ label: 'Afternoon', start: '12:00', end: '18:00' },
		{ label: 'Evening', start: '18:00', end: '23:00' },
		{ label: 'Late Night', start: '23:00', end: '02:00' }
	];

	// Track loading states for each slot
	let loadingSlots = $state<Set<string>>(new Set());
	let clearingDays = $state<Set<number>>(new Set());
	
	// Local state for availability (for optimistic updates)
	let localAvailability = $state<typeof data.availability>([...data.availability]);
	
	// Track pending operations to prevent race conditions
	let pendingOperations = $state<Map<string, AbortController>>(new Map());

	// Update local availability when data changes
	$effect(() => {
		localAvailability = [...data.availability];
	});

	// Group availability by day
	const availabilityByDay = $derived.by(() => {
		const grouped: Record<number, typeof localAvailability> = {};
		for (let i = 0; i < 7; i++) {
			grouped[i] = [];
		}
		localAvailability.forEach(avail => {
			grouped[avail.dayOfWeek].push(avail);
		});
		return grouped;
	});

	// Check if a time slot is available
	function hasAvailability(dayOfWeek: number, startTime: string, endTime: string): boolean {
		return availabilityByDay[dayOfWeek].some(
			avail => avail.startTime === startTime && avail.endTime === endTime
		);
	}

	// Get availability ID for a slot
	function getAvailabilityId(dayOfWeek: number, startTime: string, endTime: string): string | null {
		const avail = availabilityByDay[dayOfWeek].find(
			a => a.startTime === startTime && a.endTime === endTime
		);
		return avail?.id || null;
	}

	// Generate a unique key for a slot
	function getSlotKey(dayOfWeek: number, startTime: string, endTime: string): string {
		return `${dayOfWeek}-${startTime}-${endTime}`;
	}

	// Cancel any pending operation for a slot
	function cancelPendingOperation(key: string) {
		const controller = pendingOperations.get(key);
		if (controller) {
			controller.abort();
			pendingOperations.delete(key);
		}
	}

	// Toggle availability slot with optimistic updates
	async function toggleSlot(dayOfWeek: number, startTime: string, endTime: string) {
		const slotKey = getSlotKey(dayOfWeek, startTime, endTime);
		const hasIt = hasAvailability(dayOfWeek, startTime, endTime);
		
		// Cancel any pending operation for this slot
		cancelPendingOperation(slotKey);
		
		// Create new abort controller for this operation
		const abortController = new AbortController();
		pendingOperations.set(slotKey, abortController);
		
		// Set loading state
		loadingSlots.add(slotKey);
		
		// Store original state for rollback
		const originalAvailability = [...localAvailability];
		
		try {
			if (hasIt) {
				// Remove availability (optimistic update)
				const availabilityId = getAvailabilityId(dayOfWeek, startTime, endTime);
				if (!availabilityId) {
					loadingSlots.delete(slotKey);
					return;
				}
				
				// Optimistically remove from local state
				localAvailability = localAvailability.filter(a => a.id !== availabilityId);
				
				// Send request to server
				const formData = new FormData();
				formData.append('availabilityId', availabilityId);

				const response = await fetch('?/deleteAvailability', {
					method: 'POST',
					body: formData,
					signal: abortController.signal
				});

				const result = await response.json();
				
				if (!response.ok || result.type !== 'success') {
					// Rollback on error
					localAvailability = originalAvailability;
					toast.error('Failed to remove availability');
				} else {
					toast.success('Availability removed');
				}
			} else {
				// Add availability (optimistic update)
				const tempId = `temp-${Date.now()}-${Math.random()}`;
				const newAvailability = {
					id: tempId,
					userId: data.session?.user?.id || '',
					dayOfWeek,
					startTime,
					endTime,
					isRecurring: true,
					specificDate: null,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				
				// Optimistically add to local state
				localAvailability = [...localAvailability, newAvailability];
				
				// Send request to server
				const formData = new FormData();
				formData.append('dayOfWeek', dayOfWeek.toString());
				formData.append('startTime', startTime);
				formData.append('endTime', endTime);

				const response = await fetch('?/setAvailability', {
					method: 'POST',
					body: formData,
					signal: abortController.signal
				});

				const result = await response.json();
				
				if (!response.ok || result.type !== 'success') {
					// Rollback on error
					localAvailability = originalAvailability;
					toast.error('Failed to add availability');
				} else {
					// Update with real ID from server
					if (result.data?.availability) {
						localAvailability = localAvailability.map(a => 
							a.id === tempId ? { ...result.data.availability } : a
						);
					}
					toast.success('Availability added!');
				}
			}
		} catch (error: any) {
			if (error.name !== 'AbortError') {
				console.error('Toggle error:', error);
				// Rollback on error
				localAvailability = originalAvailability;
				toast.error('Something went wrong');
			}
		} finally {
			loadingSlots.delete(slotKey);
			pendingOperations.delete(slotKey);
		}
	}

	// Clear entire day with optimistic updates
	async function clearDay(dayOfWeek: number) {
		const dayAvailability = availabilityByDay[dayOfWeek];
		if (dayAvailability.length === 0) return;
		
		// Cancel any pending operations for this day's slots
		dayAvailability.forEach(avail => {
			const key = getSlotKey(dayOfWeek, avail.startTime, avail.endTime);
			cancelPendingOperation(key);
		});
		
		clearingDays.add(dayOfWeek);
		
		// Store original state for rollback
		const originalAvailability = [...localAvailability];
		
		// Optimistically remove all availability for this day
		localAvailability = localAvailability.filter(a => a.dayOfWeek !== dayOfWeek);

		try {
			const formData = new FormData();
			formData.append('dayOfWeek', dayOfWeek.toString());

			const response = await fetch('?/clearDay', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			
			if (!response.ok || result.type !== 'success') {
				// Rollback on error
				localAvailability = originalAvailability;
				toast.error('Failed to clear day');
			} else {
				toast.success('Day cleared');
			}
		} catch (error) {
			console.error('Clear error:', error);
			// Rollback on error
			localAvailability = originalAvailability;
			toast.error('Something went wrong');
		} finally {
			clearingDays.delete(dayOfWeek);
		}
	}

	// Clean up abort controllers on unmount
	$effect(() => {
		return () => {
			pendingOperations.forEach(controller => controller.abort());
			pendingOperations.clear();
		};
	});
</script>

<svelte:head>
	<title>My Availability - ShiftHappens</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-slate-900 dark:text-white">My Availability</h1>
		<p class="text-slate-600 dark:text-slate-400 mt-1">
			Let us know when you can work. Tap a time slot to toggle it.
		</p>
	</div>

	<!-- Info Card -->
	<div class="card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
		<div class="flex items-start gap-3">
			<div class="text-xl">💡</div>
			<div class="flex-1 text-sm text-blue-900 dark:text-blue-100">
				<p class="font-medium mb-1">How it works</p>
				<p class="text-blue-800 dark:text-blue-200">
					Select the time slots when you're generally available. Your manager will see this when creating schedules. Changes are saved automatically.
				</p>
			</div>
		</div>
	</div>

	<!-- Weekly Grid -->
	<div class="card p-6">
		<div class="space-y-6">
			{#each daysOfWeek as day, dayIndex}
				{@const dayAvailability = availabilityByDay[dayIndex]}
				{@const hasAny = dayAvailability.length > 0}
				{@const isClearing = clearingDays.has(dayIndex)}

				<div>
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-bold text-lg text-slate-900 dark:text-white">
							{day}
						</h3>
						{#if hasAny}
							<button
								type="button"
								onclick={() => clearDay(dayIndex)}
								disabled={isClearing}
								class="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isClearing ? 'Clearing...' : 'Clear day'}
							</button>
						{/if}
					</div>

					<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
						{#each timeSlots as slot}
							{@const slotKey = getSlotKey(dayIndex, slot.start, slot.end)}
							{@const isAvailable = hasAvailability(dayIndex, slot.start, slot.end)}
							{@const isLoading = loadingSlots.has(slotKey)}

							<button
								type="button"
								onclick={() => toggleSlot(dayIndex, slot.start, slot.end)}
								disabled={isLoading || isClearing}
								class="p-3 rounded-lg border-2 transition-all text-left relative {isAvailable
									? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600'
									: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'} 
									{isLoading || isClearing ? 'opacity-60 cursor-wait' : ''}"
							>
								<div class="font-medium text-sm text-slate-900 dark:text-white">
									{slot.label}
								</div>
								<div class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
									{slot.start} - {slot.end}
								</div>
								{#if isAvailable}
									<div class="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
										✓ Available
									</div>
								{/if}
								{#if isLoading}
									<div class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-lg">
										<div class="animate-spin h-5 w-5 border-2 border-slate-500 border-t-transparent rounded-full"></div>
									</div>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Summary Card -->
	{#if localAvailability.length > 0}
		<div class="card p-6">
			<h3 class="font-bold text-slate-900 dark:text-white mb-3">Your Availability Summary</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				{#each daysOfWeek as day, dayIndex}
					{@const count = availabilityByDay[dayIndex].length}
					{#if count > 0}
						<div class="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
							<div class="text-2xl font-bold text-primary-500">{count}</div>
							<div class="text-xs text-slate-600 dark:text-slate-400">{day.slice(0, 3)}</div>
						</div>
					{/if}
				{/each}
			</div>
			<div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
				Total slots: <span class="font-medium text-slate-900 dark:text-white">{localAvailability.length}</span>
			</div>
		</div>
	{:else}
		<div class="card p-12 text-center">
			<div class="text-5xl mb-4">📅</div>
			<h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">
				No availability set yet
			</h3>
			<p class="text-slate-600 dark:text-slate-400">
				Tap the time slots above to let your manager know when you can work
			</p>
		</div>
	{/if}
</div>
