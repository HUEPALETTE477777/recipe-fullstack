// BEAUTIFUL REFACTOR
// COMPONENTS -> SERVICES -> AXIOS INSTANCE

import axios from 'axios';
import { supabase } from '../lib/SupabaseClient';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
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
// GO STRIAGHT THROUGH IF OUR REQUEST IS SUCCESSFUL
api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        // CHECK IF WE ARE UNAUTHORIZED
        if (error.response?.status === 401) {
            alert("SESSION EXPIRED OR INVALID. LOGGING YOU OUT");

            await supabase.auth.signOut();
            localStorage.removeItem('sb-access-token');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        if (error.response?.status === 403) {
            alert("ACCESS DENIED: NO PERMISSION TO MODIFY THIS RESOURCe");
        }

        return Promise.reject(error);
    }
)

export default api;