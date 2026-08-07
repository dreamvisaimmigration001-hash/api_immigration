import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import rateLimit from 'express-rate-limit';
import { authenticate, authorize } from '../middleware/auth.js';

// Rate limiter for login: max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);

// Protected routes for Admin
// Only admin can create employes
router.post('/employe', authenticate, authorize('admin'), userController.createEmploye);

// Protected routes for Employe
// Only employes can create users
// (If you also want admins to be able to create users, you would use: authorize(['admin', 'employe']))
router.post('/user', authenticate, authorize(['admin', 'employe']), userController.createUser);
// Protected route to get all standard users
router.get('/users', authenticate, authorize(['admin', 'employe']), userController.getUsers);
// Example of a protected route accessible by any authenticated role
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
