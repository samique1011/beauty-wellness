const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    slotIds: [{ type: String }] 
});


const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String }, 
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    image: { type: String }, 
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', unique: true, required: true }, 
    visits: { type: Number, default: 0 } 
});

const serviceSchema = new mongoose.Schema({
    shopid: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    availability: {
        startTime: { type: String, required: true }, 
        endTime: { type: String, required: true }   
    }
});

const bookingSchema = new mongoose.Schema({
    time: { type: String, required: true },
    date: { type: String, required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    adminComment: { type: String } 
});


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
