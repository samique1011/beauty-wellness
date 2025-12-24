import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';

const UserDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await apiRequest('/bookings');
                setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Your Appointments</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {bookings.map(booking => (
                        <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{booking.serviceId?.title || 'Unknown Service'}</h3>
                                    <p className="text-gray-500 mt-1 flex items-center">
                                        <span className="mr-2">📅</span> {booking.date}
                                        <span className="mx-2">|</span>
                                        <span className="mr-2">⏰</span> {booking.time}
                                    </p>
                                </div>
                                <span className={`mt-4 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium
                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>
                            {booking.adminComment && (
                                <div className="mt-4 bg-blue-50 text-blue-800 text-sm p-3 rounded-lg border border-blue-100">
                                    <span className="font-bold mr-2">Admin Note:</span>
                                    {booking.adminComment}
                                </div>
                            )}
                        </div>
                    ))}
                    {bookings.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            <p className="mb-4">You haven't booked any services yet.</p>
                            <a href="/" className="text-purple-600 font-medium hover:underline">Browse Shops</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
