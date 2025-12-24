import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [shops, setShops] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [comments, setComments] = useState({});

    const fetchData = async () => {
        try {
            const shopsData = await apiRequest('/shops');
            setShops(shopsData);
            const bookingsData = await apiRequest('/bookings');
            setBookings(bookingsData);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            await apiRequest(`/bookings/${bookingId}/status`, 'PUT', {
                status: newStatus,
                adminComment: comments[bookingId] || ''
            });
            fetchData(); // Refresh list
            toast.success(`Booking ${newStatus}`);
            // Clear comment for this booking
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

    const serviceStats = bookings.reduce((acc, booking) => {
        const serviceName = booking.serviceId?.title || 'Unknown';
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black rounded-xl shadow-lg p-6 text-white border border-gray-800">
                    <h3 className="text-lg font-medium opacity-80">Total Shops</h3>
                    <p className="text-4xl font-bold mt-2">{shops.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900 border border-gray-200">
                    <h3 className="text-lg font-medium opacity-80">Total Bookings</h3>
                    <p className="text-4xl font-bold mt-2">{bookings.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Services</h3>
                    <ul className="space-y-2">
                        {Object.entries(serviceStats).slice(0, 3).map(([name, count]) => (
                            <li key={name} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{name}</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">{count}</span>
                            </li>
                        ))}
                        {Object.keys(serviceStats).length === 0 && <li className="text-gray-400 italic">No bookings yet</li>}
                    </ul>
                </div>
            </div>

            {/* Bookings Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Manage Bookings</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {bookings.map(booking => (
                        <div key={booking._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-colors">
                            <div className="mb-4 md:mb-0">
                                <h4 className="text-lg font-bold text-gray-900">{booking.serviceId?.title || 'Unknown Service'}</h4>
                                <p className="text-sm text-gray-500">
                                    <span className="font-bold text-indigo-600">User: {booking.userId?.name || 'Unknown User'}</span> <br />
                                    {booking.date} @ {booking.time}
                                </p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                                <textarea
                                    placeholder="Add comment (optional)..."
                                    value={comments[booking._id] || ''}
                                    onChange={(e) => setComments({ ...comments, [booking._id]: e.target.value })}
                                    className="border rounded p-2 text-sm w-full md:w-64 h-20 resize-none focus:ring-purple-500 focus:border-purple-500"
                                />
                                <div className="flex space-x-2 justify-end">
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
                    ))}
                    {bookings.length === 0 && <p className="p-6 text-gray-500 italic text-center">No bookings found</p>}
                </div>
            </div>



            {/* Manage Shops List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Manage Shops</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {shops.map(shop => (
                        <div key={shop._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mr-4">
                                    <img src={shop.image || 'https://via.placeholder.com/100'} alt="" className="h-full w-full object-cover" />
                                </div>
                                <span className="font-medium text-gray-900">{shop.name}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteShop(shop._id)}
                                className="text-red-600 hover:text-red-900 font-medium text-sm border border-red-200 hover:bg-red-50 px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {shops.length === 0 && <p className="p-6 text-gray-500 italic">No shops to manage.</p>}
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
