import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ManageServices = () => {
    const [shops, setShops] = useState([]);
    const [newShop, setNewShop] = useState({ name: '', location: '', image: '', description: '', imageFile: null });
    const [newService, setNewService] = useState({ shopid: '', title: '', description: '', price: '' });

    const fetchShops = async () => {
        try {
            const shopsData = await apiRequest('/shops');
            setShops(shopsData);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch shops');
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleAddShop = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newShop.name);
            formData.append('location', newShop.location);
            formData.append('description', newShop.description);
            if (newShop.imageFile) {
                formData.append('image', newShop.imageFile);
            }

            await apiRequest('/shops', 'POST', formData);
            setNewShop({ name: '', location: '', image: '', description: '', imageFile: null });
            fetchShops();
            toast.success('Shop added successfully!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await apiRequest('/services', 'POST', newService);
            setNewService({ shopid: '', title: '', description: '', price: '' });
            toast.success('Service added!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Services & Shops</h1>
                <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-black">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Add Shop Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Parlour</h3>
                    <form onSubmit={handleAddShop} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text" placeholder="Shop Name" required
                                value={newShop.name} onChange={e => setNewShop({ ...newShop, name: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border"
                            />
                            <input
                                type="text" placeholder="Location" required
                                value={newShop.location} onChange={e => setNewShop({ ...newShop, location: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border"
                            />
                        </div>
                        <input
                            type="text" placeholder="Description (e.g., Best parlor for...)"
                            value={newShop.description} onChange={e => setNewShop({ ...newShop, description: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border"
                        />

                        <div
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${newShop.imageFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-black'}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) setNewShop({ ...newShop, imageFile: file });
                            }}
                            onClick={() => document.getElementById('shopImageInput').click()}
                        >
                            <input
                                id="shopImageInput"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) setNewShop({ ...newShop, imageFile: e.target.files[0] });
                                }}
                            />
                            {newShop.imageFile ? (
                                <div className="text-center">
                                    <p className="text-green-600 font-medium">{newShop.imageFile.name}</p>
                                    <p className="text-xs text-green-500">Ready to upload</p>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p className="font-medium">Drag & Drop Image</p>
                                    <p className="text-xs mt-1">or click to browse</p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors shadow-sm">
                            Add Shop
                        </button>
                    </form>
                </div>

                {/* Add Service Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Add Service</h3>
                    <form onSubmit={handleAddService} className="space-y-6">
                        <select
                            required value={newService.shopid} onChange={e => setNewService({ ...newService, shopid: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border"
                        >
                            <option value="">Select Shop</option>
                            {shops.map(shop => <option key={shop._id} value={shop._id}>{shop.name}</option>)}
                        </select>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text" placeholder="Service Title" required
                                value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border"
                            />
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                <input
                                    type="number" placeholder="Price" required
                                    value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 pl-8 border"
                                />
                            </div>
                        </div>
                        <input
                            type="text" placeholder="Description"
                            value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border"
                        />
                        <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors shadow-sm">
                            Add Service
                        </button>
                    </form>
                </div>
            </div>

            {/* Manage Services by Shop */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Manage Services</h3>
                <div className="space-y-8">
                    {shops.map(shop => (
                        <div key={shop._id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">🏪</span> {shop.name}
                            </h4>
                            <div className="pl-4 space-y-3">
                                {shop.serviceIds && shop.serviceIds.length > 0 ? (
                                    shop.serviceIds.map(service => (
                                        <div key={service._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-medium text-gray-900">{service.title}</p>
                                                <p className="text-sm text-gray-500">₹{service.price}</p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    if (!window.confirm(`Delete service "${service.title}"?`)) return;
                                                    try {
                                                        await apiRequest(`/services/${service._id}`, 'DELETE');
                                                        fetchShops();
                                                        toast.success('Service deleted');
                                                    } catch (err) {
                                                        toast.error(err.message);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium border border-red-200 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No services added yet.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ManageServices;
