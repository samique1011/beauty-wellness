import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let data;
            if (isAdminLogin) {
                // Admin Login with Email & Password
                data = await apiRequest('/login-admin', 'POST', { email: formData.email, password: formData.password });
            } else {
                // Regular User Login
                data = await apiRequest('/login', 'POST', { email: formData.email, password: formData.password });
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isAdminLogin ? 'Admin Access' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isAdminLogin ? 'Sign in to access admin dashboard' : 'Sign in to your account'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {isAdminLogin ? (
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-4">
                                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                                <input
                                    id="admin-email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="admin-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    id="admin-password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-4">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all hover:-translate-y-0.5"
                        >
                            {isAdminLogin ? 'Access Dashboard' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => {
                            setIsAdminLogin(!isAdminLogin);
                            setError('');
                            setFormData({ email: '', password: '' });
                        }}
                        className="text-sm font-medium text-black hover:text-gray-700 transition-colors"
                    >
                        {isAdminLogin ? '← Back to User Login' : 'Login as Admin'}
                    </button>

                    {!isAdminLogin && (
                        <div className="text-sm">
                            <span className="text-gray-500">No account? </span>
                            <Link to="/register" className="font-medium text-black hover:text-gray-700">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
