import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { sendPasswordResetEmail } from '$lib/server/email/send';
import { env } from '$env/dynamic/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import crypto from 'crypto';
import { getSession } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	const session = await getSession(event);

	// Redirect to dashboard if already logged in
	if (session?.user) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		if (!email) {
			return fail(400, {
				error: 'Email is required',
				email
			});
		}

		try {
			// Check if user exists
			const user = await prisma.user.findUnique({
				where: { email }
			});

			// Always return success to prevent email enumeration
			// But only send email if user actually exists
			if (user) {
				// Generate reset token
				const resetToken = crypto.randomBytes(32).toString('hex');
				const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

				// Store reset token
				await prisma.verificationToken.create({
					data: {
						identifier: email,
						token: resetToken,
						expires: resetExpires
					}
				});

				// Send reset email
				const resetUrl = `${PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
				await sendPasswordResetEmail(email, user.name, resetUrl);
			}

			// Always redirect to success page
			throw redirect(303, '/auth/forgot-password/sent?email=' + encodeURIComponent(email));
		} catch (error) {
			console.error('Password reset error:', error);
			return fail(500, {
				error: 'Failed to send reset email. Please try again.',
				email
			});
		}
	}
} satisfies Actions;
