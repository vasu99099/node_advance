import ServiceFactory from '../factories/ServiceFactory.js';
import LoggerFactory from '../factories/LoggerFactory.js';

class HealthService {
  static logger = LoggerFactory.createLogger('health-service');

  static async checkGatewayHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };
  }

  static async checkServiceHealth(serviceName) {
    try {
      const service = ServiceFactory.getService(serviceName);
      const healthUrl = `${service.url}/health`;
      
      this.logger.info('Checking service health', { service: serviceName, url: healthUrl });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'API-Gateway-Health-Check/1.0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseData = await response.json().catch(() => ({}));
      
      const result = {
        service: serviceName,
        status: response.ok ? 'healthy' : 'unhealthy',
        statusCode: response.status,
        responseTime: Date.now(),
        timestamp: new Date().toISOString(),
        url: healthUrl,
        response: responseData
      };
      
      if (response.ok) {
        this.logger.info('Service health check passed', { service: serviceName, status: response.status });
      } else {
        this.logger.warn('Service health check failed', { 
          service: serviceName, 
          status: response.status,
          response: responseData 
        });
      }
      
      return result;
      
    } catch (error) {
      this.logger.error('Service health check error', {
        service: serviceName,
        error: error.message,
        type: error.name
      });
      
      return {
        service: serviceName,
        status: 'unhealthy',
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString()
      };
    }
  }

  static async checkAllServices() {
    const services = ServiceFactory.getAllServices();
    
    if (services.length === 0) {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: [],
        summary: {
          total: 0,
          healthy: 0,
          unhealthy: 0
        }
      };
    }
    
    const healthChecks = await Promise.allSettled(
      services.map(service => this.checkServiceHealth(service.name))
    );

    const results = healthChecks.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          service: services[index].name,
          status: 'unhealthy',
          error: result.reason?.message || 'Health check failed',
          timestamp: new Date().toISOString()
        };
      }
    });

    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const overallStatus = healthyCount === results.length ? 'healthy' : 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: results,
      summary: {
        total: results.length,
        healthy: healthyCount,
        unhealthy: results.length - healthyCount
      }
    };
  }

  static async getDetailedHealth() {
    const [gatewayHealth, servicesHealth] = await Promise.all([
      this.checkGatewayHealth(),
      this.checkAllServices()
    ]);

    return {
      gateway: gatewayHealth,
      services: servicesHealth
    };
  }
}

export default HealthService;