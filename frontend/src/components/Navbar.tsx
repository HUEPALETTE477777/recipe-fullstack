import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react';

export default function Navbar() {
    // USE SESSION FOR SPEED + FRONTEND, NO VALIDATIOn
    const { session, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/?q=${encodeURIComponent(searchInput.trim())}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="bg-amber-300">
            <div className="flex justify-between gap-4 px-4 py-3 bg-red-100 text-center">
                {/* LEFT SIDE OF NAV BAR */}
                <div className="flex gap-6 items-center">
                    <Link to="/" className="hover:text-violet-600">
                        HOME
                    </Link>
                    <Link to="/create" className=" hover:text-violet-600">
                        CREATE RECIPE
                    </Link>
                    <Link to="/my-recipes" className=" hover:text-violet-600">
                        MY RECIPES
                    </Link>
                </div>

                {/* MIDDLE SEARCH BAR */}
                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4">
                    <input 
                        type="text"
                        placeholder="Search recipes or authors..."
                        value={searchInput}
                        onChange={(evt) => setSearchInput(evt.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-white text-gray-800"
                    />
                </form>

                {/* RIGHT SIDE OF NAVBAR */}
                <div className="flex gap-6 items-center">
                    {session ? (
                        <>
                            <span>{session.user.user_metadata.full_name}</span>
                            <img src={session.user.user_metadata.picture || session.user.user_metadata.avatar_url} className="w-8 h-8 rounded-full" />
                            {/* <span>{session.user.email}</span> */}
                            <button onClick={logout}
                                className="hover:cursor-pointer bg-red-400 text-white"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </div>
    )
}
