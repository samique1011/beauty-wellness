import React from 'react';

const ServiceCard = ({ service, onBook }) => {
    return (
        <div className="bg-white border border-gray-100 p-6 mb-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-center group">
            <div className="mb-4 sm:mb-0">
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{service.title}</h4>
                <p className="text-gray-500 mt-1">{service.description}</p>
                <div className="mt-2 text-xl font-bold text-gray-900">₹{service.price}</div>
            </div>
            <button
                onClick={() => onBook(service)}
                className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors transform active:scale-95"
            >
                Book Now
            </button>
        </div>
    );
};

export default ServiceCard;
