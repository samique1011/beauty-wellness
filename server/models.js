const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    slotIds: [{ type: String }] // Keeping it simple as array of strings for now
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Shop Schema
const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String }, // New field
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    image: { type: String } // URL or placeholder
});

// Service Schema
const serviceSchema = new mongoose.Schema({
    shopid: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }
});

// Booking Schema
// bookings table having (id , time , date , userId , serviced , status of booking)
// Assuming 'serviced' is 'serviceId' from context.
const bookingSchema = new mongoose.Schema({
    time: { type: String, required: true },
    date: { type: String, required: true }, // Keeping strict to requirements: simple string or Date
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    adminComment: { type: String } // Comment from admin when changing status
});

// Review Schema
// reviews table having (id , userid , timestamp , shopid)
const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Shop = mongoose.model('Shop', shopSchema);
const Service = mongoose.model('Service', serviceSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { User, Admin, Shop, Service, Booking, Review };
