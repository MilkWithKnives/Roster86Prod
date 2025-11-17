import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { signIn } from '@auth/sveltekit/client';
import { getSession } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	const session = await getSession(event);

	// Redirect to dashboard if already logged in
	if (session?.user) {
		throw redirect(303, '/dashboard');
	}

	// Get query params for success messages
	const url = new URL(event.request.url);
	const signup = url.searchParams.get('signup');
	const magicLink = url.searchParams.get('magicLink');

	return {
		signupSuccess: signup === 'success',
		magicLinkSent: magicLink === 'sent'
	};
};

export const actions = {
	// Email/Password Login
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const remember = data.get('remember') === 'on';

		console.log('Login attempt for email:', email);

		if (!email || !password) {
			console.log('Login failed: Missing email or password');
			return fail(400, {
				error: 'Email and password are required',
				email
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			console.log('Login failed: Invalid email format');
			return fail(400, {
				error: 'Please enter a valid email address',
				email
			});
		}

		// Note: The actual authentication happens client-side via Auth.js signIn()
		// This server action is mainly for form validation and logging
		// Auth.js will use the credentials provider in hooks.server.ts for authentication
		console.log('Login form validation passed, client-side auth will handle authentication');
		return { success: true };
	},

	// Magic Link for Employees
	magicLink: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		if (!email) {
			return fail(400, {
				magicLinkError: 'Email is required'
			});
		}

		try {
			// Auth.js Email provider will handle sending the magic link
			// This will be triggered client-side
			return { magicLinkSuccess: true };
		} catch (error) {
			console.error('Magic link error:', error);
			return fail(500, {
				magicLinkError: 'Failed to send magic link. Please try again.'
			});
		}
	}
} satisfies Actions;
