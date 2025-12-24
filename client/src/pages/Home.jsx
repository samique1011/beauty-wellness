import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import ShopCard from '../components/ShopCard';

const Home = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
                    Discover <span className="text-black underline decoration-4 underline-offset-4">Beauty & Wellness</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Find and book the best salons, spas, and wellness centers near you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                {shops.map(shop => (
                    <ShopCard key={shop._id} shop={shop} />
                ))}
            </div>

            {shops.length === 0 && (
                <div className="text-center text-gray-500 mt-12">
                    <p>No shops available yet. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
