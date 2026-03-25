// backend/src/modules/auth/auth.services.js

import { hashPassword, comparePassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';
import { BadRequestError, UnauthorizedError } from '../../utils/apiError.js';

export function authService(db) {
    console.log('DB CLIENT IN AUTH:', db.constructor.name);
  return {
    
    async registerUser({ name, email, password }) {
      const existing = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existing.rowCount > 0) {
        throw new BadRequestError('Email already registered');
      }

      const passwordHash = await hashPassword(password);

      const result = await db.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, role`,
        [name, email, passwordHash]
      );

      const user = result.rows[0];

      const token = signToken({
        sub: user.id,
        role: user.role,
        email: user.email
      });

      return { user, token };
    },

    async loginUser({ email, password }) {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rowCount === 0) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const user = result.rows[0];
      const valid = await comparePassword(password, user.password_hash);

      if (!valid) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const token = signToken({
        sub: user.id,
        role: user.role,
        email: user.email
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      };
    }
  };
}
