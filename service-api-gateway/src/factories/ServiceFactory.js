import { createProxyMiddleware } from "http-proxy-middleware";
import LoggerFactory from "./LoggerFactory.js";
import ServiceValidator from "../validators/ServiceValidator.js";

class ServiceFactory {
  static logger = LoggerFactory.createLogger("service-factory");
  static services = new Map();

  static registerService(name, config) {
    ServiceValidator.validateServiceName(name);
    ServiceValidator.validateServiceConfig(config);

    const serviceConfig = {
      name,
      url: config.url,
      routes: config.routes || [`/${name}`],
      healthCheck: config.healthCheck || `${config.url}/health`,
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      ...config,
    };

    this.services.set(name, serviceConfig);
    this.logger.info("Service registered", { name, url: serviceConfig.url });
    return serviceConfig;
  }

  static getService(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }
    return service;
  }

  static createServiceProxy(serviceName) {
    const service = this.getService(serviceName);
    console.log(`Creating proxy for ${serviceName} -> ${service.url}`);

    return createProxyMiddleware({
      target: service.url,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Handle POST data
        if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    });
  }



  static getAllServices() {
    return Array.from(this.services.entries()).map(([name, config]) => ({
      name,
      url: config.url,
      routes: config.routes,
    }));
  }
}

export default ServiceFactory;
