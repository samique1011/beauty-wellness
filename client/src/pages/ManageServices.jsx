import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ManageServices = () => {
    const [shop, setShop] = useState(null);
    const [newService, setNewService] = useState({ title: '', description: '', price: '' });
    const [loading, setLoading] = useState(true);

    const fetchShopData = async () => {
        try {
            const data = await apiRequest('/admin/dashboard');
            if (data.hasShop) {
                setShop(data.shop);
            } else {
                toast.warn("Please create a shop first.");
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch shop data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopData();
    }, []);

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            // Backend now infers shop from logged-in admin
            const payload = {
                ...newService,
                availability: {
                    startTime: newService.startTime,
                    endTime: newService.endTime
                }
            };
            await apiRequest('/services', 'POST', payload);
            setNewService({ title: '', description: '', price: '', startTime: '', endTime: '' });
            toast.success('Service added!');
            fetchShopData(); // Refresh list
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );

    if (!shop) return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No Shop Found</h2>
            <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 underline">Go to Dashboard to create one.</Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
                    <p className="text-gray-500">{shop.name}</p>
                </div>
                <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-black bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Service Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Service</h3>
                        <form onSubmit={handleAddService} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text" required
                                    value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border"
                                    placeholder="e.g. Haircut"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number" required
                                    value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border h-24"
                                    placeholder="Optional details..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time" required
                                        value={newService.startTime || ''}
                                        onChange={e => setNewService({ ...newService, startTime: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time" required
                                        value={newService.endTime || ''}
                                        onChange={e => setNewService({ ...newService, endTime: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Add Service
                            </button>
                        </form>
                    </div>
                </div>

                {/* Services List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Current Services</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {shop.serviceIds && shop.serviceIds.length > 0 ? (
                                shop.serviceIds.map(service => (
                                    <div key={service._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{service.title}</h4>
                                            <p className="text-sm text-gray-500">{service.description}</p>
                                            <p className="text-indigo-600 font-bold mt-1">₹{service.price}</p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm(`Delete "${service.title}"?`)) return;
                                                try {
                                                    await apiRequest(`/services/${service._id}`, 'DELETE');
                                                    fetchShopData();
                                                    toast.success('Service deleted');
                                                } catch (err) {
                                                    toast.error(err.message);
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                            title="Delete Service"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 italic">
                                    No services added yet. Add one from the form.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageServices;
