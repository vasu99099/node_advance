import express from 'express';
import HealthController from '../controllers/HealthController.js';

const router = express.Router();

router.get('/', HealthController.getGatewayHealth);
router.get('/services', HealthController.getAllServicesHealth);
router.get('/services/:serviceName', HealthController.getServiceHealth);
router.get('/detailed', HealthController.getDetailedHealth);

export default router;