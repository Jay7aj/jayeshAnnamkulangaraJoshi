console.log('AUTH ROUTES LOADED');
const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email.toLowerCase(), hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(409).json({ error: 'User already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', (req,res)=>{
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }


    db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, user)=>{
            if(err || !user){
                return res.status(401).json({error: 'Invalid credentials'});
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match){
                return res.status(401).json({error: 'Invalid credentials'});
            }

            const token = jwt.sign(
                {id: user.id},
                JWT_SECRET,
                {expiresIn: '1h'}
            );
            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    );
});

module.exports = router;