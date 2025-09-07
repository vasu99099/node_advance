// Legacy file - configuration now handled by ConfigFactory
// This file is kept for backward compatibility
export const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
    routes: ['/auth']
  },
  address: {
    url: process.env.ADDRESS_SERVICE_URL || 'http://localhost:4005',
    routes: ['/addresses']
  },
  inventory: {
    url: process.env.INVENTORY_SERVICE_URL || 'http://localhost:4002',
    routes: ['/inventory']
  },
  order: {
    url: process.env.ORDER_SERVICE_URL || 'http://localhost:4003',
    routes: ['/orders']
  },
  notification: {
    url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4004',
    routes: ['/notifications']
  }
};