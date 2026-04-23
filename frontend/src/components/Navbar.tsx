import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
    // USE SESSION FOR SPEED + FRONTEND, NO VALIDATIOn
    const { session, logout } = useAuth();

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
