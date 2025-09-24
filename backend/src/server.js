import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { attachUserIfPresent } from './services/security.js';

import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import recordsRouter from './routes/records.js';
import healthRouter from './routes/health.js';
import { initDb } from './services/db.js';

const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json({ limit: '1mb' }));
app.use(attachUserIfPresent);
// Log with user id when available
morgan.token('user', (req) => (req.user ? `user=${req.user.id}` : 'user=anon'));
app.use(morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms :user'));

app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/records', recordsRouter);
app.use('/api/health', healthRouter);

app.use((err, req, res, next) => {
  // Generic error handler
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Database initialization failed', e);
    process.exit(1);
  });


