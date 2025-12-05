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

export interface Appointment {
    id: string;
    start_date: string;
    end_date: string;
    status: string;
    client: { username: string; email: string };
    variation: { name: string; price: number; duration_minutes: number };
}

export interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface TimeSlot {
    start: string;
    end: string;
}