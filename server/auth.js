const jwt = require('jsonwebtoken');
const JWT_SECRET = 'project123'; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const generateToken = (user) => {
    const role = user.role || 'user';
    return jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = { verifyToken, generateToken };
