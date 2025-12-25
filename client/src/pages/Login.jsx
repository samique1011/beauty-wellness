import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let data;
            if (isLogin) {
                // Login
                data = await apiRequest('/login', 'POST', { email: formData.email, password: formData.password });
            } else {
                // Register
                data = await apiRequest('/register', 'POST', formData);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/'); // Redirect to Home/Dashboard
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-center text-sm text-gray-500 mb-8">
                        {isLogin ? 'Sign in to access your bookings' : 'Join us for a premium experience'}
                    </p>

                    {/* Toggle Buttons */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isLogin ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${!isLogin ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Name Field - Only for Signup */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required={!isLogin}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all hover:-translate-y-0.5 shadow-md"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {isLogin ? "Are you a business owner?" : "Want to register your business?"}{" "}
                        <Link to="/admin/auth" className="font-medium text-black hover:underline">
                            {isLogin ? "Admin Login" : "Partner with us"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
