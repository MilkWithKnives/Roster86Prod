import type { PageServerLoad } from './$types';
import { SUBSCRIPTION_PLANS } from '$lib/server/stripe.js';

export const load: PageServerLoad = async () => {
	return {
		plans: SUBSCRIPTION_PLANS
	};
};
