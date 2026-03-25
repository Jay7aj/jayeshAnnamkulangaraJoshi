// backend/src/modules/users/users.routes.js

import { Router } from "express";
import { authenticateJWT } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export function createUserRoutes({ db }) {
  const router = Router();

  router.get(
    "/",
    authenticateJWT,
    requireRole("ADMIN"),
    async (req, res) => {
      const result = await db.query(
        "SELECT id, name, email FROM users"
      );

      res.json({ data: result.rows });
    }
  );

  return router;
}