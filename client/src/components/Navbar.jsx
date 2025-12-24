import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;

    // Logic fix: Ensure token and user are valid before showing logged-in state
    const isLoggedIn = !!token && !!user;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-black shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-white transform hover:scale-105 transition-transform">
                Beauty&Wellness
            </Link>
            <div className="flex items-center space-x-6">
                {isLoggedIn ? (
                    <>
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin" className="text-gray-300 hover:text-white font-medium transition-colors">
                                    Admin Dashboard
                                </Link>
                                <Link to="/admin/manage" className="text-gray-300 hover:text-white font-medium transition-colors border-l border-gray-700 pl-4">
                                    Manage Services
                                </Link>
                            </>
                        )}
                        {user.role !== 'admin' && (
                            <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors">
                                My Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg font-bold shadow-sm transition-all transform hover:-translate-y-0.5"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="bg-white hover:bg-gray-100 text-black px-5 py-2 rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
