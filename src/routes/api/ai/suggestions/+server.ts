import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
	try {
		// Require authentication
		await requireAuth(event);
		
		const { context } = await event.request.json();

		const suggestions = getContextualSuggestions(context);

		return json({
			type: 'success',
			data: { suggestions }
		});

	} catch (error) {
		console.error('AI Suggestions API Error:', error);
		return json({
			type: 'error',
			error: 'Failed to get suggestions'
		}, { status: 500 });
	}
};

function getContextualSuggestions(context: any): string[] {
	const suggestions: string[] = [];

	switch (context.currentPage) {
		case 'schedule':
			suggestions.push(
				'How do I create a new shift?',
				'Can you help me optimize this week\'s schedule?',
				'What are the best practices for shift assignments?',
				'How can I handle scheduling conflicts?',
				'Show me how to use the auto-scheduler'
			);
			
			if (context.selectedShifts?.length) {
				suggestions.push(
					`Analyze these ${context.selectedShifts.length} selected shifts`,
					'Suggest employees for these shifts',
					'Check for scheduling conflicts'
				);
			}
			break;

		case 'employees':
			suggestions.push(
				'How do I add a new employee?',
				'How can I manage employee availability?',
				'What skills should I track for employees?',
				'How do I set up employee preferences?',
				'Explain the employee role system'
			);
			
			if (context.selectedEmployees?.length) {
				suggestions.push(
					`Analyze availability for ${context.selectedEmployees.length} employees`,
					'Show me their scheduling patterns',
					'Check their skill compatibility'
				);
			}
			break;

		case 'reports':
			suggestions.push(
				'How do I generate a schedule report?',
				'What metrics should I track?',
				'How can I analyze labor costs?',
				'Show me scheduling efficiency trends',
				'Explain the coverage analysis'
			);
			break;

		case 'settings':
			suggestions.push(
				'Help me configure scheduling constraints',
				'What are the optimal scheduling settings?',
				'How do I set up labor law compliance?',
				'Explain the different solver options',
				'How can I improve scheduling fairness?'
			);
			break;

		case 'availability':
			suggestions.push(
				'How do I set my availability?',
				'Can I request specific shifts?',
				'How do I handle time-off requests?',
				'What happens if I\'m unavailable?',
				'How does the system match me to shifts?'
			);
			break;

		default:
			suggestions.push(
				'How does the scheduling system work?',
				'What features are available to me?',
				'How can I get started?',
				'Show me the main scheduling workflow',
				'What are the key concepts I should know?'
			);
	}

	// Add time-sensitive suggestions
	const now = new Date();
	const hour = now.getHours();
	
	if (hour >= 9 && hour <= 17) {
		suggestions.push('What should I focus on during business hours?');
	}
	
	if (now.getDay() === 1) { // Monday
		suggestions.push('Help me plan this week\'s schedule');
	}
	
	if (now.getDay() === 5) { // Friday
		suggestions.push('How can I prepare for next week?');
	}

	// Limit to 8 suggestions and randomize order
	return suggestions.sort(() => Math.random() - 0.5).slice(0, 8);
}
