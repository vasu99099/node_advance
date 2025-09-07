import HealthService from '../services/HealthService.js';
import LoggerFactory from '../factories/LoggerFactory.js';

class HealthController {
  static logger = LoggerFactory.createLogger('health-controller');

  static async getGatewayHealth(req, res) {
    try {
      const health = await HealthService.checkGatewayHealth();
      res.json({ 
        success: true, 
        message: 'Gateway health check completed',
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Gateway health check failed', { error: error.message });
      res.status(500).json({ 
        success: false, 
        message: 'Health check failed',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getAllServicesHealth(req, res) {
    try {
      const servicesHealth = await HealthService.checkAllServices();
      const statusCode = servicesHealth.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json({ 
        success: true, 
        message: 'Services health check completed',
        data: servicesHealth,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Services health check failed', { error: error.message });
      res.status(500).json({ 
        success: false, 
        message: 'Services health check failed',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getServiceHealth(req, res) {
    try {
      const { serviceName } = req.params;
      const serviceHealth = await HealthService.checkServiceHealth(serviceName);
      const statusCode = serviceHealth.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json({ 
        success: true, 
        message: `Health check completed for ${serviceName}`,
        data: serviceHealth,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Service health check failed', { 
        service: req.params.serviceName,
        error: error.message 
      });
      res.status(500).json({ 
        success: false, 
        message: `Health check failed for service: ${req.params.serviceName}`,
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getDetailedHealth(req, res) {
    try {
      const health = await HealthService.getDetailedHealth();
      const hasUnhealthyServices = health.services.services.some(s => s.status !== 'healthy');
      const statusCode = hasUnhealthyServices ? 503 : 200;
      res.status(statusCode).json({ 
        success: true, 
        message: 'Detailed health check completed',
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Detailed health check failed', { error: error.message });
      res.status(500).json({ 
        success: false, 
        message: 'Health check failed',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default HealthController;