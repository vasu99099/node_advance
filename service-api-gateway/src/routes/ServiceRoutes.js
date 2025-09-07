import express from 'express';
import ServiceFactory from '../factories/ServiceFactory.js';
import MiddlewareFactory from '../factories/MiddlewareFactory.js';

const router = express.Router();

// Public routes
router.use('/auth', ServiceFactory.createServiceProxy('auth'));

// Protected routes
const authMiddleware = MiddlewareFactory.createAuthMiddleware();
router.use('/addresses', authMiddleware, ServiceFactory.createServiceProxy('address'));
router.use('/inventory', authMiddleware, ServiceFactory.createServiceProxy('inventory'));
router.use('/orders', authMiddleware, ServiceFactory.createServiceProxy('order'));
router.use('/notifications', authMiddleware, ServiceFactory.createServiceProxy('notification'));

export default router;