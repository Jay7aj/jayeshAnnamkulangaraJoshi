// backend/src/modules/auth/auth.controller.js
import { authService } from './auth.services.js';

export function createAuthController({ db }) {
  const service = authService(db);

  return {
    async register(req, res, next) {
      try {
        const { name, email, password } = req.body;

        const result = await service.registerUser({
          name,
          email,
          password
        });

        res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },

    async login(req, res, next) {
      try {
        const { email, password } = req.body;

        const result = await service.loginUser({
          email,
          password
        });

        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  };
}
