// BEAUTIFUL REFACTOR
// COMPONENTS -> SERVICES -> AXIOS INSTANCE

import axios from 'axios';
import { supabase } from '../lib/SupabaseClient';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// REQUEST INTERCEPTOR
// RETRIEVE cURRENT SESSION JWT AND INJECT INTO AUTHORIZATION HEADER
// HANDLES THE ANNOYING AUTH BULLSHID
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// RESPONSE INTERCEPTOR
// AUTOMATE CLEAN UP 
api.interceptors.response.use((response) => { return response },
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("SESSION EXPIRED OR INVALID. LOGGING YOU OUT");
            await supabase.auth.signOut();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
)

export default api;