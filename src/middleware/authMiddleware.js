const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ detail: 'Authorization token is missing.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
        req.user = payload;
        next();
    } catch (_err) {
        return res.status(401).json({ detail: 'Invalid or expired token.' });
    }
}

module.exports = authMiddleware;
