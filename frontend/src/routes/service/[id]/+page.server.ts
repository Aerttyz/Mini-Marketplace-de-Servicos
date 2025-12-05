import { api } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const service = await api(`/services/${params.id}`);

    return {
        service
    };
};