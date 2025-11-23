<script lang="ts">
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { toast } from 'svelte-sonner';
	import { formatDate, formatTime as formatTimeUtil } from '$lib/utils/date';

	interface Props {
		open: boolean;
		onClose: () => void;
		locations: any[];
		users: any[];
		selectedDate?: Date | null;
		shift?: any | null; // For editing existing shifts
	}

	let { open = $bindable(), onClose, locations, users, selectedDate = null, shift = null }: Props = $props();

	// Form state with proper initialization
	let locationId = $state('');
	let userId = $state('');
	let role = $state('');
	let date = $state('');
	let startTime = $state('09:00');
	let endTime = $state('17:00');
	let breakMinutes = $state(30);
	let hourlyRate = $state('');
	let notes = $state('');

	// Shift requirements
	let requiredSkills = $state<string[]>([]);
	let shiftType = $state('');
	let priority = $state(0);
	let minSeniority = $state('');

	let submitting = $state(false);
	
	// Track original values for partial updates
	let originalValues = $state<Record<string, any>>({});
	let isEditMode = $state(false);

	// Initialize form when modal opens with shift data
	function initializeForm() {
		if (!open) return;
		
		// Ensure we have locations before proceeding
		if (!locations || locations.length === 0) {
			console.warn('No locations available');
			return;
		}

		isEditMode = !!shift?.id;
		
		if (shift?.id) {
			// Editing existing shift - populate all fields
			console.log('🔍 Initializing form for shift edit:', shift.id);
			
			locationId = shift.locationId || shift.location?.id || locations[0]?.id || '';
			userId = shift.userId || '';
			role = shift.role || '';
			
			// Handle date/time properly
			const shiftStart = new Date(shift.startTime);
			date = formatDate(shiftStart);
			startTime = formatTimeUtil(shift.startTime);
			endTime = formatTimeUtil(shift.endTime);
			
			breakMinutes = shift.breakMinutes ?? 30;
			hourlyRate = shift.hourlyRate?.toString() || '';
			notes = shift.notes || '';
			requiredSkills = Array.isArray(shift.requiredSkills) ? [...shift.requiredSkills] : [];
			shiftType = shift.shiftType || '';
			priority = shift.priority ?? 0;
			minSeniority = shift.minSeniority?.toString() || '';
			
			// Store original values for comparison
			originalValues = {
				locationId,
				userId,
				role,
				date,
				startTime,
				endTime,
				breakMinutes,
				hourlyRate,
				notes,
				requiredSkills: [...requiredSkills],
				shiftType,
				priority,
				minSeniority
			};
			
			console.log('✅ Form populated with:', {
				role,
				date,
				time: `${startTime} - ${endTime}`,
				location: locationId
			});
		} else {
			// Creating new shift - use defaults
			console.log('🔍 Initializing form for new shift');
			resetToDefaults();
			
			// Use selected date if provided
			if (selectedDate) {
				date = formatDate(selectedDate);
			}
		}
	}

	// Reset form to default values
	function resetToDefaults() {
		locationId = locations?.[0]?.id || '';
		userId = '';
		role = '';
		date = selectedDate ? formatDate(selectedDate) : formatDate(new Date());
		startTime = '09:00';
		endTime = '17:00';
		breakMinutes = 30;
		hourlyRate = '';
		notes = '';
		requiredSkills = [];
		shiftType = '';
		priority = 0;
		minSeniority = '';
		originalValues = {};
		isEditMode = false;
	}

	// Watch for modal open/close and shift changes
	$effect(() => {
		if (open) {
			// Initialize form when modal opens
			initializeForm();
		}
	});

	// Watch for shift prop changes while modal is open
	$effect(() => {
		if (open && shift) {
			// Re-initialize if shift changes while modal is open
			initializeForm();
		}
	});

	// Common restaurant roles
	const commonRoles = [
		'Server',
		'Bartender',
		'Host/Hostess',
		'Cook',
		'Line Cook',
		'Prep Cook',
		'Dishwasher',
		'Manager',
		'Assistant Manager',
		'Runner',
		'Busser',
		'Barback'
	];

	// Skill options (same as employee modal for consistency)
	const skillOptions = [
		'Server', 'Bartender', 'Host', 'Busser', 'Cook', 'Prep Cook',
		'Line Cook', 'Dishwasher', 'Manager', 'Cash Handling', 'POS System',
		'Food Safety Certified', 'Alcohol Service Certified'
	];

	// Shift type options
	const shiftTypeOptions = [
		{ value: '', label: 'Not specified' },
		{ value: 'morning', label: 'Morning (6am-12pm)' },
		{ value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
		{ value: 'evening', label: 'Evening (5pm-11pm)' },
		{ value: 'overnight', label: 'Overnight (11pm-6am)' }
	];

	// Skill input
	let newSkill = $state('');

	function addSkill() {
		if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
			requiredSkills = [...requiredSkills, newSkill.trim()];
			newSkill = '';
		}
	}

	function removeSkill(skill: string) {
		requiredSkills = requiredSkills.filter(s => s !== skill);
	}

	// Get only changed fields for partial update
	function getChangedFields(): Record<string, any> {
		if (!isEditMode) return {}; // Return empty for new shifts
		
		const changes: Record<string, any> = {};
		
		// Check each field for changes
		if (locationId !== originalValues.locationId) changes.locationId = locationId;
		if (userId !== originalValues.userId) changes.userId = userId || null;
		if (role !== originalValues.role) changes.role = role;
		if (date !== originalValues.date) changes.date = date;
		if (startTime !== originalValues.startTime) changes.startTime = startTime;
		if (endTime !== originalValues.endTime) changes.endTime = endTime;
		if (breakMinutes !== originalValues.breakMinutes) changes.breakMinutes = breakMinutes;
		if (hourlyRate !== originalValues.hourlyRate) changes.hourlyRate = hourlyRate || null;
		if (notes !== originalValues.notes) changes.notes = notes || null;
		if (JSON.stringify(requiredSkills) !== JSON.stringify(originalValues.requiredSkills)) {
			changes.requiredSkills = requiredSkills;
		}
		if (shiftType !== originalValues.shiftType) changes.shiftType = shiftType || null;
		if (priority !== originalValues.priority) changes.priority = priority;
		if (minSeniority !== originalValues.minSeniority) changes.minSeniority = minSeniority || null;
		
		return changes;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		
		// Validate required fields
		if (!locationId || !role || !date || !startTime || !endTime) {
			toast.error('Please fill in all required fields');
			return;
		}
		
		submitting = true;

		try {
			const formData = new FormData();
			
			if (isEditMode && shift?.id) {
				// For updates, send shift ID and only changed fields
				formData.append('shiftId', shift.id);
				
				const changes = getChangedFields();
				if (Object.keys(changes).length === 0) {
					toast.info('No changes to save');
					submitting = false;
					return;
				}
				
				// Always include these for server-side validation
				formData.append('locationId', locationId);
				formData.append('role', role);
				formData.append('date', date);
				formData.append('startTime', startTime);
				formData.append('endTime', endTime);
				
				// Add other fields
				formData.append('userId', userId || '');
				formData.append('breakMinutes', breakMinutes.toString());
				formData.append('hourlyRate', hourlyRate || '');
				formData.append('notes', notes || '');
				formData.append('requiredSkills', JSON.stringify(requiredSkills));
				formData.append('shiftType', shiftType || '');
				formData.append('priority', priority.toString());
				formData.append('minSeniority', minSeniority || '');
				
				// Add a flag to indicate partial update
				formData.append('partialUpdate', 'true');
				formData.append('changedFields', JSON.stringify(Object.keys(changes)));
			} else {
				// For new shifts, send all fields
				formData.append('locationId', locationId);
				formData.append('userId', userId || '');
				formData.append('role', role);
				formData.append('date', date);
				formData.append('startTime', startTime);
				formData.append('endTime', endTime);
				formData.append('breakMinutes', breakMinutes.toString());
				formData.append('hourlyRate', hourlyRate || '');
				formData.append('notes', notes || '');
				formData.append('requiredSkills', JSON.stringify(requiredSkills));
				formData.append('shiftType', shiftType || '');
				formData.append('priority', priority.toString());
				formData.append('minSeniority', minSeniority || '');
			}

			const action = isEditMode ? '?/updateShift' : '?/createShift';
			const response = await fetch(action, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			
			if (response.ok && result.type === 'success') {
				toast.success(isEditMode ? 'Shift updated successfully!' : 'Shift created successfully!');
				
				// Close modal and trigger refresh
				onClose();
				
				// Trigger a data refresh instead of full page reload
				// This should be handled by the parent component
				window.dispatchEvent(new CustomEvent('shift-updated', { 
					detail: { shift: result.data?.shift } 
				}));
				
				// Only reload if event handling isn't implemented yet
				if (!window.onshiftupdate) {
					window.location.reload();
				}
			} else {
				toast.error(result.error?.message || 'Failed to save shift');
			}
		} catch (error) {
			console.error('Submit error:', error);
			toast.error('Something went wrong. Please try again.');
		} finally {
			submitting = false;
		}
	}

	async function handleDelete() {
		if (!shift?.id) return;
		
		if (!confirm(`Are you sure you want to delete this shift for ${role} on ${date}?`)) {
			return;
		}

		submitting = true;
		const formData = new FormData();
		formData.append('shiftId', shift.id);

		try {
			const response = await fetch('?/deleteShift', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			
			if (response.ok && result.type === 'success') {
				toast.success('Shift deleted successfully');
				onClose();
				
				// Trigger refresh
				window.dispatchEvent(new CustomEvent('shift-deleted', { 
					detail: { shiftId: shift.id } 
				}));
				
				// Fallback to reload if event handling isn't implemented
				if (!window.onshiftdelete) {
					window.location.reload();
				}
			} else {
				toast.error(result.error?.message || 'Failed to delete shift');
			}
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('Something went wrong. Please try again.');
		} finally {
			submitting = false;
		}
	}

	// Clean up when modal closes
	function handleClose() {
		// Don't reset immediately to prevent flicker
		onClose();
		
		// Reset after animation completes
		setTimeout(() => {
			if (!open) {
				resetToDefaults();
			}
		}, 300);
	}
</script>

{#if open}
	<!-- Modal Overlay -->
	<div 
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		onclick={handleClose}
	>
		<!-- Modal Content -->
		<div 
			class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
				<h2 class="text-2xl font-bold text-slate-900 dark:text-white">
					{isEditMode ? 'Edit Shift' : 'Create New Shift'}
				</h2>
				<button
					type="button"
					onclick={handleClose}
					class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl"
					aria-label="Close modal"
				>
					✕
				</button>
			</div>

			<!-- Modal Body -->
			<form onsubmit={handleSubmit} class="p-6 space-y-6">
				<!-- Location Selection -->
				<div>
					<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
						Location *
					</label>
					<select
						bind:value={locationId}
						required
						disabled={submitting}
						class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#each locations as location}
							<option value={location.id}>{location.name}</option>
						{/each}
					</select>
				</div>

				<!-- Employee Selection -->
				<div>
					<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
						Employee
					</label>
					<select
						bind:value={userId}
						disabled={submitting}
						class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<option value="">Unassigned</option>
						{#each users as user}
							<option value={user.id}>{user.name} ({user.role.toLowerCase()})</option>
						{/each}
					</select>
					<p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
						Leave unassigned to create an open shift
					</p>
				</div>

				<!-- Role -->
				<div>
					<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
						Role/Position *
					</label>
					<input
						type="text"
						bind:value={role}
						required
						disabled={submitting}
						list="roles"
						placeholder="Select or type a role"
						class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
					<datalist id="roles">
						{#each commonRoles as commonRole}
							<option value={commonRole}></option>
						{/each}
					</datalist>
				</div>

				<!-- Date and Times -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<Input
							type="date"
							label="Date"
							bind:value={date}
							required
							disabled={submitting}
						/>
					</div>
					<div>
						<Input
							type="time"
							label="Start Time"
							bind:value={startTime}
							required
							disabled={submitting}
						/>
					</div>
					<div>
						<Input
							type="time"
							label="End Time"
							bind:value={endTime}
							required
							disabled={submitting}
						/>
					</div>
				</div>

				<!-- Break and Rate -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Break (minutes)
						</label>
						<input
							type="number"
							bind:value={breakMinutes}
							min="0"
							step="15"
							disabled={submitting}
							class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Hourly Rate (optional)
						</label>
						<input
							type="number"
							bind:value={hourlyRate}
							min="0"
							step="0.01"
							disabled={submitting}
							placeholder="Uses employee's default rate"
							class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- Shift Requirements Section -->
				<div class="border-t border-slate-200 dark:border-slate-700 pt-6">
					<div class="flex items-center gap-2 mb-4">
						<svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<h3 class="text-lg font-semibold text-slate-900 dark:text-white">
							Shift Requirements
						</h3>
					</div>
					<p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
						Help the auto-scheduler find the right person for this shift
					</p>

					<!-- Required Skills -->
					<div class="mb-6">
						<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Required Skills
						</label>
						<div class="space-y-3">
							<!-- Skill Tags -->
							{#if requiredSkills.length > 0}
								<div class="flex flex-wrap gap-2">
									{#each requiredSkills as skill}
										<span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
											{skill}
											<button
												type="button"
												onclick={() => removeSkill(skill)}
												disabled={submitting}
												class="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full p-0.5 transition-colors disabled:opacity-50"
												aria-label="Remove {skill}"
											>
												<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
												</svg>
											</button>
										</span>
									{/each}
								</div>
							{/if}

							<!-- Add Skill Input -->
							<div class="flex gap-2">
								<input
									type="text"
									bind:value={newSkill}
									placeholder="Add required skill"
									disabled={submitting}
									class="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
									onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
								/>
								<button
									type="button"
									onclick={addSkill}
									disabled={submitting}
									class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Add
								</button>
							</div>

							<!-- Quick Add Skills -->
							<div class="flex flex-wrap gap-2">
								{#each skillOptions.filter(s => !requiredSkills.includes(s)) as skillOption}
									<button
										type="button"
										onclick={() => requiredSkills = [...requiredSkills, skillOption]}
										disabled={submitting}
										class="px-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										+ {skillOption}
									</button>
								{/each}
							</div>
						</div>
					</div>

					<!-- Shift Type, Priority, Min Seniority -->
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Shift Type
							</label>
							<select
								bind:value={shiftType}
								disabled={submitting}
								class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#each shiftTypeOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Priority (0-10)
							</label>
							<input
								type="range"
								bind:value={priority}
								min="0"
								max="10"
								disabled={submitting}
								class="w-full disabled:opacity-50"
							/>
							<div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
								<span>Low</span>
								<span class="font-medium text-slate-700 dark:text-slate-300">{priority}</span>
								<span>High</span>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Min Seniority (Years)
							</label>
							<input
								type="number"
								bind:value={minSeniority}
								min="0"
								max="50"
								placeholder="0"
								disabled={submitting}
								class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
							/>
						</div>
					</div>
				</div>

				<!-- Notes -->
				<div>
					<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
						Notes (optional)
					</label>
					<textarea
						bind:value={notes}
						rows="3"
						disabled={submitting}
						placeholder="Any special instructions or notes..."
						class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
					></textarea>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
					<div>
						{#if isEditMode && shift?.id}
							<Button
								type="button"
								variant="ghost"
								onclick={handleDelete}
								disabled={submitting}
								class="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
							>
								🗑️ Delete Shift
							</Button>
						{/if}
					</div>
					<div class="flex gap-3">
						<Button 
							type="button" 
							variant="ghost" 
							onclick={handleClose}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button 
							type="submit" 
							variant="primary" 
							loading={submitting}
						>
							{submitting ? 'Saving...' : (isEditMode ? 'Update Shift' : 'Create Shift')}
						</Button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}
