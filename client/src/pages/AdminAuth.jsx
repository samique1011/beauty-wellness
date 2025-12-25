import React, { useState } from 'react';
import { apiRequest } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', secretKey: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/login-admin' : '/register-admin';
            const res = await apiRequest(endpoint, 'POST', formData);

            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            toast.success(isLogin ? 'Welcome back, Admin!' : 'Admin Account Created');
            navigate('/admin');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                        Admin Portal
                    </h2>

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

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Secret Key - Only for Signup */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                            <input
                                type="password"
                                required={!isLogin}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors"
                                placeholder="Enter admin secret key"
                                value={formData.secretKey}
                                onChange={e => setFormData({ ...formData, secretKey: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transform transition-all hover:-translate-y-0.5 shadow-lg"
                    >
                        {isLogin ? 'Access Dashboard' : 'Create Admin Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;
