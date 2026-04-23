import { supabase } from "../../lib/SupabaseClient";

export default function Login() {
    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        })
        if (error) {
            console.error('ERROR LOGGING IN', error.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>MY AUTISM</h1>
            <button
                onClick={loginWithGoogle}
                className="bg-gray-900 text-white px-4 py-2 hover:cursor-pointer"
            >
                LOGIN WITH GOOGLE
            </button>
        </div>
    );
}

