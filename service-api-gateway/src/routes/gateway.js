import express from 'express';
import HealthRoutes from './HealthRoutes.js';
import ServiceRoutes from './ServiceRoutes.js';

const router = express.Router();

router.use('/health', HealthRoutes);
router.use('/', ServiceRoutes);

export default router;
