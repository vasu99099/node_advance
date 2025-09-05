import express from 'express';
import { createServiceProxy } from '../middleware/proxy.js';

const router = express.Router();

// Auth service routes
router.use('/auth/*', createServiceProxy('auth'));

// Address service routes  
router.use('/api/users/:userId/addresses*', createServiceProxy('address'));

// Inventory service routes
router.use('/inventory/*', createServiceProxy('inventory'));

// Order service routes
router.use('/orders/*', createServiceProxy('order'));

// Notification service routes
router.use('/notifications/*', createServiceProxy('notification'));

export default router;