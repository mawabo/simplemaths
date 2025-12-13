
const { admin } = require('../config/firebase');

async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Unauthorized: No token provided' });
    }

    const token = header.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(403).send({ error: 'Unauthorized: Invalid token' });
    }
}

module.exports = authMiddleware;
