import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { errorHandler } from './middleware/error.middleware.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next)=>{
  const start = Date.now();

  res.on('finish', ()=>{
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });

  next();
})

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
