import { writable } from 'svelte/store';

export interface ChatMessage {
	id: string;
	type: 'user' | 'ai' | 'system';
	content: string;
	timestamp: Date;
	context?: SchedulingContext;
}

export interface SchedulingContext {
	currentPage?: string;
	selectedShifts?: any[];
	selectedEmployees?: any[];
	currentWeek?: string;
	recentActions?: string[];
	organizationData?: {
		employees: any[];
		shifts: any[];
		locations: any[];
	};
}

export interface AIContextState {
	messages: ChatMessage[];
	context: SchedulingContext;
	isLoading: boolean;
	sessionId: string;
}

// Create initial state
function createAIContext() {
	const initialState: AIContextState = {
		messages: [],
		context: {
			currentPage: 'unknown',
			recentActions: []
		},
		isLoading: false,
		sessionId: crypto.randomUUID()
	};

	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		
		// Add a new message to the conversation
		addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
			update(state => ({
				...state,
				messages: [
					...state.messages,
					{
						...message,
						id: crypto.randomUUID(),
						timestamp: new Date()
					}
				]
			}));
		},

		// Update the current context
		updateContext: (newContext: Partial<SchedulingContext>) => {
			update(state => ({
				...state,
				context: {
					...state.context,
					...newContext
				}
			}));
		},

		// Add an action to recent actions
		addAction: (action: string) => {
			update(state => ({
				...state,
				context: {
					...state.context,
					recentActions: [
						action,
						...(state.context.recentActions || [])
					].slice(0, 10) // Keep only last 10 actions
				}
			}));
		},

		// Set loading state
		setLoading: (loading: boolean) => {
			update(state => ({
				...state,
				isLoading: loading
			}));
		},

		// Clear conversation but keep context
		clearMessages: () => {
			update(state => ({
				...state,
				messages: []
			}));
		},

		// Reset everything
		reset: () => {
			set({
				messages: [],
				context: {
					currentPage: 'unknown',
					recentActions: []
				},
				isLoading: false,
				sessionId: crypto.randomUUID()
			});
		},

		// Get context summary for AI
		getContextSummary: (): string => {
			let summary = '';
			
			update(state => {
				const ctx = state.context;
				
				summary += `Current Page: ${ctx.currentPage || 'unknown'}\n`;
				
				if (ctx.currentWeek) {
					summary += `Current Week: ${ctx.currentWeek}\n`;
				}
				
				if (ctx.selectedShifts?.length) {
					summary += `Selected Shifts: ${ctx.selectedShifts.length} shifts\n`;
				}
				
				if (ctx.selectedEmployees?.length) {
					summary += `Selected Employees: ${ctx.selectedEmployees.length} employees\n`;
				}
				
				if (ctx.organizationData) {
					const org = ctx.organizationData;
					summary += `Organization: ${org.employees?.length || 0} employees, ${org.shifts?.length || 0} shifts, ${org.locations?.length || 0} locations\n`;
				}
				
				if (ctx.recentActions?.length) {
					summary += `Recent Actions: ${ctx.recentActions.slice(0, 3).join(', ')}\n`;
				}
				
				return state;
			});
			
			return summary;
		}
	};
}

export const aiContext = createAIContext();
