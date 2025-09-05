import { createProxyMiddleware } from 'http-proxy-middleware';
import { services } from '../config/services.js';

export const createServiceProxy = (serviceName) => {
  const service = services[serviceName];
  
  return createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    onError: (err, req, res) => {
      res.status(503).json({
        success: false,
        message: `${serviceName} service unavailable`,
        error: err.message
      });
    },
    onProxyReq: (proxyReq, req) => {
      console.log(`Proxying ${req.method} ${req.url} to ${service.url}`);
    }
  });
};