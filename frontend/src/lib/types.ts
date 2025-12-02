export interface User {
    id: string;
    username: string;
    email: string;
    role: 'CLIENT' | 'PROVIDER';
    access_token?: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    provider: {
        id: string;
        user: { username: string; city?: string };
    };
    variations: Variation[];
    category: { name: string };
    photos: string[];
}

export interface Variation {
    id: string;
    name: string;
    price: number;
    duration_minutes: number;
}