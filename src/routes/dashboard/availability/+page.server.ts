import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { requireAuth } from '$lib/server/auth';
import { fail, json } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const session = await requireAuth(event);

	// Get all availability records for this user
	const availability = await prisma.availability.findMany({
		where: {
			userId: session.user.id,
			isRecurring: true,
			specificDate: null // Only get recurring availability
		},
		orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
	});

	return {
		availability,
		session
	};
};

export const actions = {
	setAvailability: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, { 
				type: 'error',
				error: { message: 'Unauthorized' }
			});
		}

		const data = await request.formData();
		const dayOfWeek = parseInt(data.get('dayOfWeek') as string);
		const startTime = data.get('startTime') as string;
		const endTime = data.get('endTime') as string;

		if (isNaN(dayOfWeek) || !startTime || !endTime) {
			return fail(400, { 
				type: 'error',
				error: { message: 'Missing required fields' }
			});
		}

		// Validate day of week
		if (dayOfWeek < 0 || dayOfWeek > 6) {
			return fail(400, { 
				type: 'error',
				error: { message: 'Invalid day of week' }
			});
		}

		// Validate time format (HH:MM)
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
		if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
			return fail(400, { 
				type: 'error',
				error: { message: 'Invalid time format' }
			});
		}

		try {
			// Check if this availability already exists
			const existing = await prisma.availability.findFirst({
				where: {
					userId: session.user.id,
					dayOfWeek,
					startTime,
					endTime,
					isRecurring: true
				}
			});

			if (existing) {
				return fail(400, { 
					type: 'error',
					error: { message: 'This availability slot already exists' }
				});
			}

			// Create availability slot
			const availability = await prisma.availability.create({
				data: {
					userId: session.user.id,
					dayOfWeek,
					startTime,
					endTime,
					isRecurring: true
				}
			});

			return { 
				type: 'success',
				data: { availability }
			};
		} catch (error) {
			console.error('Set availability error:', error);
			return fail(500, { 
				type: 'error',
				error: { message: 'Failed to set availability' }
			});
		}
	},

	deleteAvailability: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, { 
				type: 'error',
				error: { message: 'Unauthorized' }
			});
		}

		const data = await request.formData();
		const availabilityId = data.get('availabilityId') as string;

		if (!availabilityId) {
			return fail(400, { 
				type: 'error',
				error: { message: 'Missing availability ID' }
			});
		}

		try {
			// Verify ownership before deleting
			const availability = await prisma.availability.findUnique({
				where: { id: availabilityId }
			});

			if (!availability) {
				return fail(404, { 
					type: 'error',
					error: { message: 'Availability not found' }
				});
			}

			if (availability.userId !== session.user.id) {
				return fail(403, { 
					type: 'error',
					error: { message: 'Not authorized to delete this availability' }
				});
			}

			await prisma.availability.delete({
				where: { id: availabilityId }
			});

			return { 
				type: 'success',
				data: { deleted: true, availabilityId }
			};
		} catch (error) {
			console.error('Delete availability error:', error);
			return fail(500, { 
				type: 'error',
				error: { message: 'Failed to delete availability' }
			});
		}
	},

	clearDay: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, { 
				type: 'error',
				error: { message: 'Unauthorized' }
			});
		}

		const data = await request.formData();
		const dayOfWeek = parseInt(data.get('dayOfWeek') as string);

		if (isNaN(dayOfWeek)) {
			return fail(400, { 
				type: 'error',
				error: { message: 'Invalid day' }
			});
		}

		// Validate day of week
		if (dayOfWeek < 0 || dayOfWeek > 6) {
			return fail(400, { 
				type: 'error',
				error: { message: 'Invalid day of week' }
			});
		}

		try {
			// Get count of items to be deleted for confirmation
			const toDelete = await prisma.availability.count({
				where: {
					userId: session.user.id,
					dayOfWeek,
					isRecurring: true
				}
			});

			if (toDelete === 0) {
				return { 
					type: 'success',
					data: { cleared: 0, dayOfWeek }
				};
			}

			// Delete all availability for this day
			const result = await prisma.availability.deleteMany({
				where: {
					userId: session.user.id,
					dayOfWeek,
					isRecurring: true
				}
			});

			return { 
				type: 'success',
				data: { cleared: result.count, dayOfWeek }
			};
		} catch (error) {
			console.error('Clear day error:', error);
			return fail(500, { 
				type: 'error',
				error: { message: 'Failed to clear day' }
			});
		}
	}
} satisfies Actions;
