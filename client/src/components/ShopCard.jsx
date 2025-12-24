import React from 'react';
import { Link } from 'react-router-dom';

const ShopCard = ({ shop }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-xl duration-300 w-full max-w-sm">
            <div className="relative h-48">
                <img
                    src={shop.image || 'https://via.placeholder.com/300x200?text=Shop+Image'}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-bold text-gray-900">{shop.averageRating ? shop.averageRating.toFixed(1) : 'New'}</span>
                    {shop.reviewCount > 0 && <span className="text-gray-500 text-xs ml-1">({shop.reviewCount})</span>}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{shop.name}</h3>
                <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <span className="mr-1">📍</span> {shop.location}
                </p>

                {shop.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {shop.description}
                    </p>
                )}

                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                        {shop.serviceIds ? `${shop.serviceIds.length} Services` : 'Explore'}
                    </span>
                </div>

                <Link
                    to={`/shop/${shop._id}`}
                    className="block w-full text-center bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                    View & Book
                </Link>
            </div>
        </div>
    );
};

export default ShopCard;
