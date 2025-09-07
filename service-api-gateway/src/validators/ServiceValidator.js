class ServiceValidator {
  static validateServiceName(serviceName) {
    if (!serviceName || typeof serviceName !== 'string') {
      throw new Error('Service name is required and must be a string');
    }
    
    if (!/^[a-zA-Z0-9-_]+$/.test(serviceName)) {
      throw new Error('Service name can only contain alphanumeric characters, hyphens, and underscores');
    }
    
    return true;
  }

  static validateServiceConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Service configuration is required');
    }
    
    if (!config.url || typeof config.url !== 'string') {
      throw new Error('Service URL is required');
    }
    
    try {
      new URL(config.url);
    } catch {
      throw new Error('Service URL must be a valid URL');
    }
    
    return true;
  }
}

export default ServiceValidator;