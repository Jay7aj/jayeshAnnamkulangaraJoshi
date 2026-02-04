import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.user = payload; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
