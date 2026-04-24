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
                console.log("API RESULT:", result);
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

    // USED BY DELETION, MIDDLEGROUND REFACOTR RATHER THAN HAVING AN ENTIRE CONTEXT/REDUX
    // IT IS A WRAPPER FOR 'setData', WHICH WILL UPDATE THE UI AS IT IS 'useState'
    const removeListItem = (id: string | number) => {
        if (Array.isArray(data)) {
            setData(data.filter(item => item.id !== id) as unknown as T);
        }
    };

    return { data, loading, error, setData, removeListItem };
}