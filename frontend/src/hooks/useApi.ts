import { useState, useEffect } from 'react';


// FORCED TO ADD A OPTION FLAG SO THE BACKEND API REQUEST
// WONT CREATE AN ASYNC RACE CONDITION

// 'useAuth' GOES TO TALK TO SUPABASE TO GET AUTH LOGIN SESSION
// 'useApi' GOES TO TALK TO SUPABASE DATABASE TO GET OTHER DATA
// THE FLAG WILL LOCK OUT 'useApi' UNTIL 'useAuth' DECIDES TO FINISH INSIDE
export function useApi<T>(
    apiFunc: () => Promise<T>, 
    dependencies: any[] = [], 
    options?: { enabled?: boolean }
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const isEnabled = options?.enabled ?? true;

    useEffect(() => {
        if (!isEnabled) {
            setLoading(true); 
            return;
        }

        let isMounted = true;

        const execute = async () => {
            try {
                setLoading(true);
                const result = await apiFunc();
                if (isMounted) {
                    setData(result);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        execute();
        return () => { isMounted = false }; 
    }, [...dependencies, isEnabled]);

    // THIS SHID IS ONLY USED IN 'MyRecipes' TO DELETE SHID. TRASH UTILITIY
    // MAYBE ONE DAY ILL REUSE IT IN OTHER COMPONENTS
    const removeListItem = (id: string | number) => {
        if (Array.isArray(data)) {
            setData(data.filter(item => item.id !== id) as unknown as T);
        }
    };

    return { data, loading, error, setData, removeListItem };
}