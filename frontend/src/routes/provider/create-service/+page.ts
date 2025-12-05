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
        throw redirect(302, '/login');
    }

    try {
        const categories = await api('/categories');
        return {
            categories: categories || []
        };
    } catch (e) {
        console.error('Erro ao carregar categorias:', e);
        return { categories: [] };
    }
};