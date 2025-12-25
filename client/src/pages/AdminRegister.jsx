import React, { useState } from 'react';
import { apiRequest } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRegister = () => {
    const [data, setData] = useState({ email: '', password: '', secretKey: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiRequest('/register-admin', 'POST', data);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            toast.success('Admin Account Created');
            navigate('/admin');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register as Admin
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or <Link to="/login" className="font-medium text-black hover:text-gray-800">sign in to existing account</Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={data.email}
                                onChange={e => setData({ ...data, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={data.password}
                                onChange={e => setData({ ...data, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                name="secretKey"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Admin Secret Key"
                                value={data.secretKey}
                                onChange={e => setData({ ...data, secretKey: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
