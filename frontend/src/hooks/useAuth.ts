import { useState, useEffect } from 'react';
import { supabase } from '../lib/SupabaseClient';
import type { User, Session } from '@supabase/supabase-js';

// 'useAuth' GOES TO TALK TO SUPABASE TO GET AUTH LOGIN SESSION
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // CHEKC FOR PREVIOUS OR ACTIVE SESSIONS AND MOUNT THAT HAWK TUAH
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            // console.log(session?.access_token ?? null)
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const googleAvatar = session.user.user_metadata?.avatar_url;
                if (googleAvatar) {
                    await supabase.from('profiles').update({ avatar_url: googleAvatar }).eq('id', session.user.id);
                }
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []) // EMPTY DEPENDENCY ARRAY RUN ONCe

    const loginWithGoogle = async () => {
        const currentOrigin = window.location.origin;
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${currentOrigin}/`
            }
        });
    };

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('sb-access-token');
    };

    return { user, session, loading, loginWithGoogle, logout };
}