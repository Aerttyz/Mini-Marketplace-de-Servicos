import { writable } from 'svelte/store';
import type { User } from './types';

export const user = writable<User | null>(null);

if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('user');
    if (stored) user.set(JSON.parse(stored));
}

user.subscribe((value) => {
    if (typeof localStorage !== 'undefined') {
        if (value) localStorage.setItem('user', JSON.stringify(value));
        else localStorage.removeItem('user');
    }
});

const API_URL = 'http://localhost:3000';

export async function api(endpoint: string, method = 'GET', body?: any, token?: string) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro na requisição');
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
}