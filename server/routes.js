const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Admin, Shop, Service, Booking, Review } = require('./models');
const { verifyToken, generateToken } = require('./auth');



router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // checking if the user exists or not
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const user = new User({ name, email, password }); 
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user._id, name: user.name, role: 'user' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.post('/register-admin', async (req, res) => {
    try {
        const { email, password, secretKey } = req.body;
        if (secretKey !== 'admin@123') {
            return res.status(403).json({ message: 'Invalid Secret Key' });
        }
        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Admin email already exists' });

        const admin = new Admin({ email, password });
        await admin.save();

        const token = jwt.sign({ id: admin._id, role: 'admin' }, 'supersecretkey_for_personal_project_123', { expiresIn: '24h' });
        res.status(201).json({ token, user: { id: admin._id, name: 'Admin', role: 'admin' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login-admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid Admin credentials' });
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, 'supersecretkey_for_personal_project_123', { expiresIn: '24h' });
        res.json({ token, user: { id: admin._id, name: 'Admin', role: 'admin' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// normal user login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: 'user' }, 'supersecretkey_for_personal_project_123', { expiresIn: '24h' });
        res.json({ token, user: { id: user._id, name: user.name, role: 'user' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// getting all shops
router.get('/shops', async (req, res) => {
    try {
        const shops = await Shop.find().populate('serviceIds');
        const reviews = await Review.find();

        const shopsWithStats = shops.map(shop => {
            const shopReviews = reviews.filter(r => r.shopId.toString() === shop._id.toString());
            const avgRating = shopReviews.length > 0
                ? (shopReviews.reduce((sum, r) => sum + r.rating, 0) / shopReviews.length)
                : 0;
            return {
                ...shop.toObject(),
                averageRating: avgRating,
                reviewCount: shopReviews.length
            };
        });

        shopsWithStats.sort((a, b) => b.averageRating - a.averageRating);

        res.json(shopsWithStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/shops/:id', async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(
            req.params.id,
            { $inc: { visits: 1 } },
            { new: true }
        ).populate('serviceIds');
        if (!shop) return res.status(404).json({ message: 'Shop not found' });
        res.json(shop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add shop (Admin only)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/shops', verifyToken, upload.single('image'), async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        // Enforce one shop per admin
        const existingShop = await Shop.findOne({ adminId: req.userId });
        if (existingShop) {
            return res.status(400).json({ message: 'You can only create one shop.' });
        }

        const { name, location, description } = req.body;
        let image = req.body.image; // fallback if URL provided in text
        if (req.file) {
            image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const shop = new Shop({ name, location, image, description, adminId: req.userId });
        await shop.save();
        res.status(201).json(shop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// deleting a shop 
router.delete('/shops/:id', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        await Shop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Shop deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//getting the services for the shop
router.get('/services/:shopId', async (req, res) => {
    try {
        const services = await Service.find({ shopid: req.params.shopId });
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adding the service
router.post('/services', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        // Find admin's shop
        const shop = await Shop.findOne({ adminId: req.userId });
        if (!shop) return res.status(404).json({ message: 'You must create a shop first' });

        const { title, description, price, availability } = req.body;
        const service = new Service({
            shopid: shop._id,
            title,
            description,
            price,
            availability: {
                startTime: availability?.startTime || "09:00", //by default values
                endTime: availability?.endTime || "17:00"
            }
        });
        await service.save();

        // pushing the service to the shop
        await Shop.findByIdAndUpdate(shop._id, { $push: { serviceIds: service._id } });

        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// deleting the service
router.delete('/services/:id', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        // removing the service from the shop 
        await Shop.updateOne(
            { _id: service.shopid },
            { $pull: { serviceIds: service._id } }
        );

        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//creating a booking for the user
router.post('/bookings', verifyToken, async (req, res) => {
    if (req.userRole === 'admin') return res.status(403).json({ message: 'Admins cannot book services' });
    try {
        const { serviceId, date, time } = req.body;
        const booking = new Booking({
            userId: req.userId,
            serviceId,
            date,
            time,
            status: 'pending' 
        });
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update booking status
router.put('/bookings/:id/status', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        const { status, adminComment } = req.body;
        const updateData = { status };
        if (adminComment !== undefined) {
            updateData.adminComment = adminComment;
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('serviceId');
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get all the bookings
router.get('/bookings', verifyToken, async (req, res) => {
    try {
        if (req.userRole === 'admin') {
            // Admin sees bookings for THEIR shop only
            const shop = await Shop.findOne({ adminId: req.userId });
            if (!shop) return res.json([]); 

            const services = await Service.find({ shopid: shop._id });
            const serviceIds = services.map(s => s._id);

            const bookings = await Booking.find({ serviceId: { $in: serviceIds } })
                .populate('userId serviceId')
                .sort({ date: 1, time: 1 }); 

            res.json(bookings);
        } else {
          
            const bookings = await Booking.find({ userId: req.userId })
                .populate({
                    path: 'serviceId',
                    populate: { path: 'shopid', select: 'name location' }
                });
            res.json(bookings);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// admin dashboard route
router.get('/admin/dashboard', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        const shop = await Shop.findOne({ adminId: req.userId }).populate('serviceIds');
        if (!shop) return res.json({ hasShop: false });

        const services = await Service.find({ shopid: shop._id });
        const serviceIds = services.map(s => s._id);
        const bookings = await Booking.find({ serviceId: { $in: serviceIds } }).populate('serviceId userId');
        const reviews = await Review.find({ shopId: shop._id });

        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
            : 0;

        const serviceStats = {};
        bookings.forEach(b => {
            const sName = b.serviceId.title;
            serviceStats[sName] = (serviceStats[sName] || 0) + 1;
        });
        const topServices = Object.entries(serviceStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));

        res.json({
            hasShop: true,
            shop,
            stats: {
                visits: shop.visits || 0,
                bookingsCount: bookings.length,
                avgRating: avgRating.toFixed(1),
                reviewCount: reviews.length,
                topServices
            },
            bookings 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// review section
router.post('/reviews', verifyToken, async (req, res) => {
    try {
        const { shopId, rating, comment } = req.body;

        const userBookings = await Booking.find({ userId: req.userId, status: 'completed' }).populate('serviceId');

        const hasVisitedShop = userBookings.some(booking =>
            booking.serviceId && booking.serviceId.shopid.toString() === shopId
        );

        if (!hasVisitedShop) {
            
            const anyBooking = await Booking.find({ userId: req.userId }).populate('serviceId');
            const hasAny = anyBooking.some(b => b.serviceId && b.serviceId.shopid.toString() === shopId);

            if (hasAny) {
                return res.status(403).json({ message: 'You can only review after your booking is marked as "Completed" by the admin.' });
            } else {
                return res.status(403).json({ message: 'You have no bookings for this shop. Book a service and complete it to leave a review.' });
            }
        }

        const review = new Review({
            userId: req.userId,
            shopId,
            rating,
            comment
        });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// getting the reviews for a shop
router.get('/reviews/:shopId', async (req, res) => {
    try {
        const reviews = await Review.find({ shopId: req.params.shopId }).populate('userId', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
