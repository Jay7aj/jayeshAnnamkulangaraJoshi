const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}


function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: 'No token provided'});
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme.toLowerCase() !== 'bearer' || !token) {
        return res.status(401).json({ error: 'Invalid token format' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = { id: decoded.id };
        next();
    });
}

module.exports = authMiddleware;