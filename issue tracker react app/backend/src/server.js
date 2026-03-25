// backend/src/server.js

import createApp from './app.js';
import { connectDB, pool } from './config/db.js';

const PORT = process.env.PORT || 5000;

(async () => {

  await connectDB();
  const app = createApp({ db: pool });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
