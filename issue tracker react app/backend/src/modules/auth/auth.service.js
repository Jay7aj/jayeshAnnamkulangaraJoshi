import {pool} from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';

export async function registerUser({name, email, password}){
    const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    );

    if (existing.rowCount >0){
        const err = new Error('Email already registered');
        err.status = 409;
        throw err;
    }

    const passwordHash = await hashPassword(password);

    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role`,
        [name, email, passwordHash]
    );

    const user = result.rows[0];

    const token = signToken({
        id: user.id,
        role: user.role,
        email: user.email
    });
    return {user, token};
}

export async function loginUser({email, password}){
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if(result.rowCount === 0){
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    const user = result.rows[0];
    const isMatch = await comparePassword(password, user.password_hash);

    if(!isMatch){
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    const token = signToken({
        id: user.id,
        role: user.role,
        email: user.email
    });

    return {
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, token
    };
}