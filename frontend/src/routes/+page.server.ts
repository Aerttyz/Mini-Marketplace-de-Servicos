import { api } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const query = search ? `?search=${search}` : '';

    const services = await api(`/services${query}`);

    return {
        services
    };
};