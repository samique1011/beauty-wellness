import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../api';
import ServiceCard from '../components/ServiceCard';
import { toast } from 'react-toastify';

const ShopDetails = () => {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingService, setBookingService] = useState(null);
    const [bookingData, setBookingData] = useState({ date: '', time: '' });
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const foundShop = await apiRequest(`/shops/${id}`);
                setShop(foundShop);

                if (foundShop) {
                    const servicesData = await apiRequest(`/services/${id}`);
                    setServices(servicesData);

                    const reviewsData = await apiRequest(`/reviews/${id}`);
                    setReviews(reviewsData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!token) return toast.error('Please login to book');

        // Date and Time Validation
        // Date and Time Validation
        const selectedDate = new Date(`${bookingData.date}T${bookingData.time}`);
        const now = new Date();

        if (selectedDate < now) {
            return toast.error('Cannot book appointments in the past');
        }

        // Check availability frame
        if (bookingService.availability) {
            const { startTime, endTime } = bookingService.availability;
            if (bookingData.time < startTime || bookingData.time > endTime) {
                return toast.error(`Booking must be between ${startTime} and ${endTime}`);
            }
        }

        try {
            await apiRequest('/bookings', 'POST', {
                serviceId: bookingService._id,
                date: bookingData.date,
                time: bookingData.time
            });
            toast.success('Booking confirmed!');
            setBookingService(null);
            setBookingData({ date: '', time: '' });
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!token) return toast.error('Please login to review');

        try {
            const newReview = await apiRequest('/reviews', 'POST', {
                shopId: id,
                ...reviewData
            });
            setReviews([...reviews, { ...newReview, userId: JSON.parse(localStorage.getItem('user')) }]);
            setReviewData({ rating: 5, comment: '' });
            toast.success('Review posted!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
    if (!shop) return <div className="text-center py-10">Shop not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
                <div className="relative h-64 sm:h-80 md:h-96">
                    <img src={shop.image || 'https://via.placeholder.com/800x400'} alt={shop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-8 text-white">
                            <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
                            <p className="flex items-center text-lg opacity-90">
                                <span className="mr-2">📍</span> {shop.location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {
                shop.description && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Parlour</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {shop.description}
                        </p>
                    </div>
                )
            }

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Services Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-gray-100 text-gray-900 p-2 rounded-lg mr-3">✂️</span>
                        Services
                    </h2>
                    <div className="space-y-4">
                        {services.map(service => (
                            <div key={service._id} className="relative">
                                <ServiceCard
                                    service={service}
                                    onBook={(s) => {
                                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                                        if (user.role === 'admin') {
                                            alert("Admins cannot book services. Please login as a user.");
                                            return;
                                        }
                                        setBookingService(s);
                                    }}
                                />
                                {/* Overlay/Disable if admin? Actually alert is enough as per requirement, or just hiding button logic inside ServiceCard better.
                                    But ServiceCard is dumb, let's keep it simple. */}
                            </div>
                        ))}
                        {services.length === 0 && <p className="text-gray-500 italic">No services listed yet.</p>}
                    </div>
                </div>

                {/* Reviews Sidebar */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-3">⭐</span>
                        Reviews
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="mb-6 max-h-96 overflow-y-auto space-y-4 pr-2">
                            {reviews.map(review => (
                                <div key={review._id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-900">{review.userId?.name || 'User'}</span>
                                        <span className="text-yellow-500 font-bold text-sm tracking-wide">{review.rating} / 5 ⭐</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                    <small className="text-gray-400 text-xs block mt-2">{new Date(review.timestamp).toLocaleDateString()}</small>
                                </div>
                            ))}
                            {reviews.length === 0 && <p className="text-gray-500 italic">No reviews yet.</p>}
                        </div>

                        {token ? (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                {/* Note: API will enforce the "completed booking" rule, but good to show UI hint. 
                                    However, checking entitlement client-side requires fetching bookings. 
                                    For now, we let the user try and catch the 403 error if not allowed. 
                                    Or we can optimistically show it. */}
                                <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                                <form onSubmit={handleReview} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                        <select
                                            value={reviewData.rating}
                                            onChange={e => setReviewData({ ...reviewData, rating: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                                        >
                                            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                        <textarea
                                            value={reviewData.comment}
                                            onChange={e => setReviewData({ ...reviewData, comment: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border h-24"
                                            placeholder="Share your experience (only if you've visited)..."
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                        Post Review
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center mt-6">Login to leave a review.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {
                bookingService && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setBookingService(null)}></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Book {bookingService.title}</h3>
                                    <form onSubmit={handleBook} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={bookingData.date}
                                                onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                                                className="border rounded-md w-full p-2"
                                            />
                                            {bookingService.availability && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Available: {bookingService.availability.startTime} - {bookingService.availability.endTime}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                            <input
                                                type="time"
                                                required
                                                value={bookingData.time}
                                                onChange={e => setBookingData({ ...bookingData, time: e.target.value })}
                                                className="border rounded-md w-full p-2"
                                            />
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none sm:col-start-2 sm:text-sm">
                                                Confirm Booking
                                            </button>
                                            <button type="button" onClick={() => setBookingService(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }


        </div >
    );
};

export default ShopDetails;
