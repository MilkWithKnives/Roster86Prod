import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/core/providers/credentials';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
import { securityHeaders } from '$lib/server/security.js';
import { rateLimitMiddleware } from '$lib/server/rateLimit.js';

// Auth.js handle
export const { handle: authHandle } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	trustHost: true,
	debug: process.env.NODE_ENV === 'development',
	basePath: '/auth',
	providers: [
		// Email/Password Login
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				console.log('🔐 Auth.js authorize called with email:', credentials?.email);

				if (!credentials?.email || !credentials?.password) {
					console.log('❌ Missing credentials - email or password not provided');
					return null;
				}

				try {
					console.log('🔍 Looking up user in database...');
					const user = await prisma.user.findUnique({
						where: { email: credentials.email as string },
						include: { Organization: true }
					});

					if (!user) {
						console.log('❌ User not found in database for email:', credentials.email);
						return null;
					}

					if (!user.password) {
						console.log('❌ User found but no password set for email:', credentials.email);
						return null;
					}

					console.log('✅ User found, verifying password...');
					const isValid = await bcrypt.compare(credentials.password as string, user.password);

					if (!isValid) {
						console.log('❌ Password verification failed for email:', credentials.email);
						return null;
					}

					console.log('✅ Authentication successful for user:', {
						id: user.id,
						email: user.email,
						name: user.name,
						role: user.role,
						organizationId: user.organizationId,
						emailVerified: user.emailVerified
					});

					return {
						id: user.id,
						email: user.email,
						name: user.name,
						role: user.role,
						organizationId: user.organizationId
					};
				} catch (error) {
					console.error('💥 Database error during authentication:', error);
					return null;
				}
			}
		})

		// Magic Link disabled temporarily - Auth.js Email provider requires nodemailer
		// We'll implement custom magic link flow later using Resend directly
	],
	callbacks: {
		async session({ session, token }) {
			console.log('🎫 Session callback called for user:', session.user?.email);
			if (token && session.user) {
				session.user.id = token.sub as string;
				session.user.role = token.role as string;
				session.user.organizationId = token.organizationId as string;
				console.log('✅ Session updated with user data:', {
					id: session.user.id,
					email: session.user.email,
					role: session.user.role,
					organizationId: session.user.organizationId
				});
			}
			return session;
		},
		async jwt({ token, user }) {
			console.log('🔑 JWT callback called');
			if (user) {
				console.log('👤 Adding user data to JWT token:', {
					id: user.id,
					email: user.email,
					role: user.role,
					organizationId: user.organizationId
				});
				token.role = user.role;
				token.organizationId = user.organizationId;
			}
			return token;
		}
	},
	events: {
		async signIn({ user, account, profile }) {
			console.log('🎉 User signed in successfully:', {
				userId: user.id,
				email: user.email,
				provider: account?.provider
			});
		},
		async signOut({ session, token }) {
			console.log('👋 User signed out:', {
				userId: session?.user?.id || token?.sub,
				email: session?.user?.email || token?.email
			});
		}
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	pages: {
		signIn: '/auth/login',
		signOut: '/auth/login',
		error: '/auth/error'
	},
	secret: env.AUTH_SECRET
});

// Authorization middleware
const authorizationHandle: Handle = async ({ event, resolve }) => {
	// Get session using the correct Auth.js method
	const session = await event.locals.auth();
	const pathname = event.url.pathname;

	// Protected routes that require authentication
	const protectedRoutes = ['/dashboard', '/schedule', '/team', '/settings'];
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

	// Owner/Manager only routes
	const adminRoutes = ['/team', '/settings/organization'];
	const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

	// Redirect to login if accessing protected route without session
	if (isProtectedRoute && !session?.user) {
		throw redirect(303, `/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
	}

	// Check for admin access
	if (isAdminRoute && session?.user) {
		const role = session.user.role;
		if (role !== 'OWNER' && role !== 'MANAGER') {
			// Redirect non-admin users to dashboard
			throw redirect(303, '/dashboard');
		}
	}

	// Redirect authenticated users away from auth pages
	if (session?.user && pathname.startsWith('/auth/')) {
		throw redirect(303, '/dashboard');
	}

	return resolve(event);
};

// Combine all handles using sequence (order matters!)
export const handle = sequence(
	securityHeaders,      // Apply security headers first
	rateLimitMiddleware,  // Then rate limiting
	authHandle,          // Then authentication
	authorizationHandle  // Finally authorization
);
