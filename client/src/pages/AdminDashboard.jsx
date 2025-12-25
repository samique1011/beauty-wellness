import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState({});

    // Shop Creation Form State
    const [shopData, setShopData] = useState({ name: '', location: '', description: '', image: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchData = async () => {
        try {
            const data = await apiRequest('/admin/dashboard');
            setDashboardData(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateShop = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', shopData.name);
            formData.append('location', shopData.location);
            formData.append('description', shopData.description);
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (shopData.image) {
                formData.append('image', shopData.image);
            }

            await apiRequest('/shops', 'POST', formData);
            toast.success('Shop created successfully!');
            fetchData(); // Refresh to show dashboard
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            await apiRequest(`/bookings/${bookingId}/status`, 'PUT', {
                status: newStatus,
                adminComment: comments[bookingId] || ''
            });
            fetchData(); // Refresh list
            toast.success(`Booking ${newStatus}`);
            setComments(prev => {
                const newComments = { ...prev };
                delete newComments[bookingId];
                return newComments;
            });
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );

    // If no shop, show creation form
    if (!dashboardData?.hasShop) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Your Shop</h1>
                    <p className="text-gray-600 mb-8">You need to set up your shop profile before you can manage services and bookings.</p>

                    <form onSubmit={handleCreateShop} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                            <input
                                type="text"
                                required
                                className="block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black"
                                value={shopData.name}
                                onChange={e => setShopData({ ...shopData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                required
                                className="block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black"
                                value={shopData.location}
                                onChange={e => setShopData({ ...shopData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black h-24"
                                value={shopData.description}
                                onChange={e => setShopData({ ...shopData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image (File or URL)</label>
                            <div className="flex space-x-4">
                                <input
                                    type="file"
                                    onChange={e => setImageFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                />
                                <input
                                    type="text"
                                    placeholder="Or Image URL"
                                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                    value={shopData.image}
                                    onChange={e => setShopData({ ...shopData, image: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                            Create Shop
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const { shop, stats, bookings } = dashboardData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard: {shop.name}</h1>
                <Link to="/admin/manage" className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Manage Services
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm font-medium uppercase">Total Visits</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.visits}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm font-medium uppercase">Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bookingsCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm font-medium uppercase">Avg Rating</p>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.avgRating} ★</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm font-medium uppercase">Top Services</p>
                    <ul className="mt-2 space-y-1">
                        {stats.topServices.map((s, i) => (
                            <li key={i} className="text-sm text-gray-700 flex justify-between">
                                <span>{s.name}</span>
                                <span className="font-bold">{s.count}</span>
                            </li>
                        ))}
                        {stats.topServices.length === 0 && <span className="text-gray-400 text-sm">No data yet</span>}
                    </ul>
                </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {bookings.map(booking => (
                        <div key={booking._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-colors">
                            <div className="mb-4 md:mb-0">
                                <h4 className="text-lg font-bold text-gray-900">{booking.serviceId?.title || 'Unknown Service'}</h4>
                                <p className="text-sm text-gray-500">
                                    <span className="font-bold text-indigo-600">User: {booking.userId?.name || 'Unknown User'}</span>
                                    <span className="mx-2">•</span>
                                    {booking.date} @ {booking.time}
                                </p>
                                <div className="mt-2 flex items-center space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {booking.status}
                                    </span>
                                    {booking.adminComment && (
                                        <span className="text-xs text-gray-500 italic">"{booking.adminComment}"</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 mt-4 md:mt-0 w-full md:w-auto">
                                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                    <textarea
                                        placeholder="Comment..."
                                        value={comments[booking._id] || ''}
                                        onChange={(e) => setComments({ ...comments, [booking._id]: e.target.value })}
                                        className="border rounded p-2 text-sm w-full md:w-48 h-10 resize-none focus:ring-black focus:border-black"
                                    />
                                    <div className="flex space-x-1">
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                            >
                                                Complete
                                            </button>
                                        )}
                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings yet.</div>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
