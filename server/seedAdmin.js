const mongoose = require('mongoose');
const { Admin } = require('./models');

mongoose.connect('mongodb://localhost:27017/appointment-booking').then(async () => {
    console.log('Connected to MongoDB');

    const email = 'admin@example.com';
    const password = 'admin123'; // In production, hash this!

    const existing = await Admin.findOne({ email });
    if (existing) {
        console.log('Admin already exists');
    } else {
        const admin = new Admin({ email, password });
        await admin.save();
        console.log(`Admin created: ${email} / ${password}`);
    }

    mongoose.connection.close();
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
