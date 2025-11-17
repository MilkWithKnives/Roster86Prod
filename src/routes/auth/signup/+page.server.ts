import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import { getSession } from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email/send';
import { env } from '$env/dynamic/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import crypto from 'crypto';

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
		const password = data.get('password') as string;
		const name = data.get('name') as string;
		const organizationName = data.get('organizationName') as string;

		// Validation
		if (!email || !password || !name || !organizationName) {
			return fail(400, {
				error: 'All fields are required',
				email,
				name,
				organizationName
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters',
				email,
				name,
				organizationName
			});
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return fail(400, {
				error: 'Email already registered',
				email,
				name,
				organizationName
			});
		}

		try {
			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Generate verification token
			const verificationToken = crypto.randomBytes(32).toString('hex');
			const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

			// Create organization and owner user in a transaction
			const result = await prisma.$transaction(async (tx) => {
				// Create organization (CUID auto-generated)
				const organization = await tx.organization.create({
					data: {
						name: organizationName,
						plan: 'free'
					}
				});

				// Create owner user (CUID auto-generated)
				const user = await tx.user.create({
					data: {
						email,
						name,
						password: hashedPassword,
						role: 'OWNER',
						organizationId: organization.id,
						emailVerified: false
					}
				});

				// Create verification token (CUID auto-generated)
				await tx.verificationToken.create({
					data: {
						identifier: email,
						token: verificationToken,
						expires: verificationExpires
					}
				});

				return { organization, user };
			});

			// Send verification email
			const verificationUrl = `${PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;
			try {
				await sendVerificationEmail(email, name, verificationUrl);
				console.log('Verification email sent successfully to:', email);
			} catch (emailError) {
				console.error('Failed to send verification email, but account was created:', emailError);
				// Continue with signup even if email fails - user can request resend later
			}

			// Redirect to check email page
			throw redirect(303, '/auth/check-email?email=' + encodeURIComponent(email));
		} catch (error) {
			console.error('Signup error:', error);
			return fail(500, {
				error: 'Failed to create account. Please try again.',
				email,
				name,
				organizationName
			});
		}
	}
} satisfies Actions;
