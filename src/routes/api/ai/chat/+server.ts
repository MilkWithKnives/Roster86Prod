import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { requireAuth } from '$lib/server/auth';

const anthropic = new Anthropic({
	apiKey: env.ANTHROPIC_API_KEY
});

export const POST: RequestHandler = async (event) => {
	try {
		// Require authentication
		const session = await requireAuth(event);
		
		const { message, context, conversationHistory, sessionId } = await event.request.json();

		if (!message) {
			return json({ type: 'error', error: 'Message is required' }, { status: 400 });
		}

		// Build context-aware prompt
		const systemPrompt = buildSystemPrompt(context, session.user);
		const conversationPrompt = buildConversationPrompt(message, conversationHistory, context);

		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 2000,
			system: systemPrompt,
			messages: [
				{
					role: 'user',
					content: conversationPrompt
				}
			]
		});

		const aiResponse = response.content[0];
		if (aiResponse.type !== 'text') {
			throw new Error('Unexpected response type from AI');
		}

		// Parse response for potential actions
		const { responseText, suggestions, actions } = parseAIResponse(aiResponse.text);

		return json({
			type: 'success',
			data: {
				response: responseText,
				suggestions,
				actions,
				sessionId
			}
		});

	} catch (error) {
		console.error('AI Chat API Error:', error);
		return json({
			type: 'error',
			error: 'Failed to process AI request'
		}, { status: 500 });
	}
};

function buildSystemPrompt(context: any, user: any): string {
	return `You are an expert scheduling assistant for ${user.organization?.name || 'the organization'}. You help managers and employees with all aspects of workforce scheduling.

**Your Capabilities:**
- Explain scheduling decisions and algorithms
- Suggest schedule optimizations and improvements
- Help with employee availability and shift management
- Provide guidance on scheduling best practices
- Assist with constraint formulation and problem-solving
- Analyze scheduling metrics and reports

**Current Context:**
- User: ${user.name} (${user.role})
- Current Page: ${context.currentPage || 'unknown'}
- Organization: ${context.organizationData?.employees?.length || 0} employees, ${context.organizationData?.locations?.length || 0} locations

**Guidelines:**
- Be helpful, friendly, and professional
- Provide specific, actionable advice
- Use scheduling terminology appropriately
- Consider labor laws and best practices
- Suggest concrete next steps when possible
- If you need more information, ask clarifying questions

**Response Format:**
- Use clear, conversational language
- Include relevant emojis for better readability
- Structure longer responses with headers and bullet points
- Provide specific examples when helpful`;
}

function buildConversationPrompt(message: string, history: any[], context: any): string {
	let prompt = '';

	// Add conversation history (last 5 messages)
	if (history && history.length > 0) {
		prompt += '**Recent Conversation:**\n';
		const recentHistory = history.slice(-5);
		for (const msg of recentHistory) {
			const role = msg.type === 'user' ? 'User' : 'Assistant';
			prompt += `${role}: ${msg.content}\n`;
		}
		prompt += '\n';
	}

	// Add current context
	if (context) {
		prompt += '**Current Context:**\n';
		
		if (context.currentWeek) {
			prompt += `- Viewing week: ${context.currentWeek}\n`;
		}
		
		if (context.selectedShifts?.length) {
			prompt += `- Selected shifts: ${context.selectedShifts.length}\n`;
		}
		
		if (context.selectedEmployees?.length) {
			prompt += `- Selected employees: ${context.selectedEmployees.length}\n`;
		}
		
		if (context.recentActions?.length) {
			prompt += `- Recent actions: ${context.recentActions.slice(0, 3).join(', ')}\n`;
		}
		
		prompt += '\n';
	}

	prompt += `**Current Question:**\n${message}`;

	return prompt;
}

function parseAIResponse(response: string): {
	responseText: string;
	suggestions?: string[];
	actions?: Array<{ type: string; data?: any }>;
} {
	// For now, return the response as-is
	// In the future, we could parse special markers for suggestions and actions
	return {
		responseText: response,
		suggestions: [],
		actions: []
	};
}
