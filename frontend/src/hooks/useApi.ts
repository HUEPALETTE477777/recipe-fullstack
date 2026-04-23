import { useState, useEffect } from 'react';


// SEXY CUSTOM HOOK, GENERIC TYPE + DEPENDENCY
// PERFECT FOR PAGE LOAD FETCHING OR SESSION FETCHING
export function useApi<T>(apiFunc: () => Promise<T>, dependencies: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        // FLAG WHEN A COMPONENT DIES WHEN USER CLICKS SHID
        // AND DATA HASNT ARRIVED YET
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
    }, dependencies);

    return { data, loading, error, setData };
}