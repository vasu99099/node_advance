#!/usr/bin/env node

/**
 * Health Check Test Script
 * Tests all health check endpoints of the API Gateway
 */

const BASE_URL = process.env.GATEWAY_URL || 'http://localhost:3000';

async function testHealthEndpoint(endpoint, description) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`📍 Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runHealthTests() {
  console.log('🚀 Starting API Gateway Health Check Tests');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  const tests = [
    {
      endpoint: '/health',
      description: 'Gateway Health Check'
    },
    {
      endpoint: '/health/services',
      description: 'All Services Health Check'
    },
    {
      endpoint: '/health/services/auth',
      description: 'Auth Service Health Check'
    },
    {
      endpoint: '/health/services/inventory',
      description: 'Inventory Service Health Check'
    },
    {
      endpoint: '/health/services/order',
      description: 'Order Service Health Check'
    },
    {
      endpoint: '/health/detailed',
      description: 'Detailed Health Check'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testHealthEndpoint(test.endpoint, test.description);
    results.push({ ...test, ...result });
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📋 Test Summary:');
  console.log('================');
  
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.description} (${result.status || 'ERROR'})`);
  });
  
  const passCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n🎯 Results: ${passCount}/${totalCount} tests passed`);
  
  if (passCount === totalCount) {
    console.log('🎉 All health checks passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some health checks failed');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthTests().catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
}