import { api } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const query = search ? `?search=${search}` : '';

    const services = await api(`/services${query}`);

    return {
        services
    };
};