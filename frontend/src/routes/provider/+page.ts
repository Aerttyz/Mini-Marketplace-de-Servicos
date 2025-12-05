import { api } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
    const stored = localStorage.getItem('user');

    if (!stored) {
        throw redirect(302, '/login');
    }

    const user = JSON.parse(stored);

    if (user.role !== 'PROVIDER') {
        throw redirect(302, '/');
    }

    try {
        const appointments = await api('/appointments/my-schedule', 'GET', null, user.access_token);

        return {
            appointments: appointments || []
        };
    } catch (e) {
        console.error('Erro ao carregar agenda:', e);
        return { appointments: [] };
    }
};