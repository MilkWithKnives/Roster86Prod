import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

export const actions = {
	contact: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const company = data.get('company') as string;
		const subject = data.get('subject') as string;
		const message = data.get('message') as string;
		const type = data.get('type') as string;

		// Basic validation
		if (!name || !email || !subject || !message || !type) {
			return fail(400, { error: 'All required fields must be filled out' });
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Please enter a valid email address' });
		}

		try {
			// Here you would typically send an email or save to database
			// For now, we'll just log the contact form submission
			console.log('Contact form submission:', {
				name,
				email,
				company,
				subject,
				message,
				type,
				timestamp: new Date().toISOString()
			});

			// In a real application, you might:
			// 1. Send an email to your support team
			// 2. Save the inquiry to a database
			// 3. Send an auto-reply to the user
			// 4. Create a ticket in your support system

			// For demonstration, we'll simulate email sending
			if (env.NODE_ENV === 'production') {
				// In production, you would integrate with an email service like:
				// - SendGrid
				// - Mailgun
				// - AWS SES
				// - Resend
				// etc.
			}

			return { success: true };
		} catch (error) {
			console.error('Contact form error:', error);
			return fail(500, { error: 'Failed to send message. Please try again later.' });
		}
	}
} satisfies Actions;
