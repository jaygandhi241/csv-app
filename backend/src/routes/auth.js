import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controller/authController.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 1 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().isLength({ min: 1 })],
  login
);

export default router;


