import type { ChatMessage, SchedulingContext } from '$lib/stores/aiContext';

export interface AIChatRequest {
	message: string;
	context: SchedulingContext;
	conversationHistory: ChatMessage[];
	sessionId: string;
}

export interface AIChatResponse {
	response: string;
	suggestions?: string[];
	actions?: {
		type: 'navigate' | 'create_shift' | 'assign_employee' | 'run_scheduler';
		data?: any;
	}[];
}

export class AIChatService {
	private baseUrl: string;

	constructor(baseUrl: string = '') {
		this.baseUrl = baseUrl;
	}

	/**
	 * Send a message to the AI assistant with full context
	 */
	async sendMessage(request: AIChatRequest): Promise<AIChatResponse> {
		try {
			const response = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(request)
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			
			if (data.type === 'success') {
				return data.data;
			} else {
				throw new Error(data.error || 'Unknown error');
			}
		} catch (error) {
			console.error('AI Chat Service Error:', error);
			return {
				response: 'Sorry, I encountered an error. Please try again or contact support if the problem persists.',
				suggestions: ['Try rephrasing your question', 'Check your internet connection', 'Refresh the page']
			};
		}
	}

	/**
	 * Get quick suggestions based on current context
	 */
	async getQuickSuggestions(context: SchedulingContext): Promise<string[]> {
		try {
			const response = await fetch('/api/ai/suggestions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ context })
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			return data.type === 'success' ? data.data.suggestions : [];
		} catch (error) {
			console.error('AI Suggestions Error:', error);
			return this.getFallbackSuggestions(context);
		}
	}

	/**
	 * Get contextual help for the current page
	 */
	async getContextualHelp(context: SchedulingContext): Promise<string> {
		try {
			const response = await fetch('/api/ai/help', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ context })
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			return data.type === 'success' ? data.data.help : this.getFallbackHelp(context);
		} catch (error) {
			console.error('AI Help Error:', error);
			return this.getFallbackHelp(context);
		}
	}

	/**
	 * Fallback suggestions when AI service is unavailable
	 */
	private getFallbackSuggestions(context: SchedulingContext): string[] {
		const suggestions: string[] = [];

		switch (context.currentPage) {
			case 'schedule':
				suggestions.push(
					'How do I create a new shift?',
					'Can you help me assign employees to shifts?',
					'What are the best practices for scheduling?'
				);
				break;
			case 'employees':
				suggestions.push(
					'How do I add a new employee?',
					'How can I manage employee availability?',
					'What skills should I track for employees?'
				);
				break;
			case 'reports':
				suggestions.push(
					'How do I generate a schedule report?',
					'What metrics should I track?',
					'How can I analyze labor costs?'
				);
				break;
			default:
				suggestions.push(
					'How does the scheduling system work?',
					'What features are available?',
					'How can I get started?'
				);
		}

		return suggestions;
	}

	/**
	 * Fallback help when AI service is unavailable
	 */
	private getFallbackHelp(context: SchedulingContext): string {
		switch (context.currentPage) {
			case 'schedule':
				return 'This is the schedule page where you can view, create, and manage shifts. Use the calendar to see your schedule and click on time slots to create new shifts.';
			case 'employees':
				return 'This is the employee management page where you can add, edit, and manage your team members and their availability.';
			case 'reports':
				return 'This is the reports page where you can view analytics and generate reports about your scheduling data.';
			default:
				return 'Welcome to the scheduling system! Use the navigation menu to access different features like schedule management, employee management, and reports.';
		}
	}
}

export const aiChatService = new AIChatService();
