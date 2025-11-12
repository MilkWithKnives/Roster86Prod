import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import { getSession } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	const session = await getSession(event);

	// Redirect to dashboard if already logged in
	if (session?.user) {
		throw redirect(303, '/dashboard');
	}

	const token = event.url.searchParams.get('token');

	if (!token) {
		throw error(400, 'Missing reset token');
	}

	// Verify token exists and is not expired
	const resetToken = await prisma.verificationToken.findUnique({
		where: { token }
	});

	if (!resetToken) {
		throw error(400, 'Invalid or expired reset token');
	}

	if (resetToken.expires < new Date()) {
		// Delete expired token
		await prisma.verificationToken.delete({
			where: { token }
		});
		throw error(400, 'Reset link has expired. Please request a new one.');
	}

	return {
		token,
		email: resetToken.identifier
	};
};

export const actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const token = data.get('token') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		if (!token || !password || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required'
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match'
			});
		}

		try {
			// Verify token
			const resetToken = await prisma.verificationToken.findUnique({
				where: { token }
			});

			if (!resetToken || resetToken.expires < new Date()) {
				return fail(400, {
					error: 'Invalid or expired reset token'
				});
			}

			// Find user
			const user = await prisma.user.findUnique({
				where: { email: resetToken.identifier }
			});

			if (!user) {
				return fail(400, {
					error: 'User not found'
				});
			}

			// Hash new password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Update password
			await prisma.user.update({
				where: { id: user.id },
				data: { password: hashedPassword }
			});

			// Delete used token
			await prisma.verificationToken.delete({
				where: { token }
			});

			// Redirect to login with success message
			throw redirect(303, '/auth/login?reset=success');
		} catch (error) {
			console.error('Password reset error:', error);
			return fail(500, {
				error: 'Failed to reset password. Please try again.'
			});
		}
	}
} satisfies Actions;
