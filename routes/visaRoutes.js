import express from 'express';
const router = express.Router();
import * as visaController from '../controllers/visaController.js';
import { authenticate, authorize } from '../middleware/auth.js';

// All visa routes require authentication
router.use(authenticate);

// Protected routes for Admin and Employe (Create, Update, Delete)
router.post('/', authorize(['admin', 'employe']), visaController.createVisa);
router.patch('/:id', authorize(['admin', 'employe']), visaController.updateVisa);
router.delete('/:id', authorize(['admin', 'employe']), visaController.deleteVisa);

// GET routes (Accessible by users for their own visas, or by admin/employe)
router.get('/user/:userId', visaController.getVisasByUser);
router.get('/grant/:grantNumber', visaController.getVisaByGrantNumber);

export default router;
