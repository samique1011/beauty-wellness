import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import ShopCard from '../components/ShopCard';
import { Link } from 'react-router-dom';

const Home = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        const fetchShops = async () => {
            try {
                const data = await apiRequest('/shops');
                setShops(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, [isLoggedIn]);

    // Guest Landing Page
    if (!isLoggedIn) {
        return (
            <div className="bg-white">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                        <span className="block xl:inline">Premium Experience</span>{' '}
                                        <span className="block text-black xl:inline">Modern Wellness</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Discover the finest salons, spas, and wellness centers. Book unique experiences with top-tier professionals on our secure platform.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10">
                                                Sign Up
                                            </Link>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10">
                                                Log In
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <img
                            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Salon Interior"
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Why Choose Us
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                We bridge the gap between you and premium care.
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                {/* Card 1 */}
                                <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Easy Scheduling</h3>
                                    <p className="mt-2 text-base text-gray-500 text-center">
                                        Book your appointments in seconds with our intuitive calendar interface. No more phone calls.
                                    </p>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Top Professionals</h3>
                                    <p className="mt-2 text-base text-gray-500 text-center">
                                        Access a curated list of top-rated experts in your area. Review ratings and choose the best.
                                    </p>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Secure Platform</h3>
                                    <p className="mt-2 text-base text-gray-500 text-center">
                                        Your data and payments are protected with industry-standard security measures.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated View (Browsing Shops)
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
            Error: {error}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Welcome Back
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Explore our network of premium wellness centers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                {shops.map(shop => (
                    <ShopCard key={shop._id} shop={shop} />
                ))}
            </div>

            {shops.length === 0 && (
                <div className="text-center text-gray-500 mt-12">
                    <p>No shops available yet.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
