#!/usr/bin/env node

/**
 * TaskForge API - Automated Testing Script
 *
 * This script tests critical API endpoints to ensure the backend is working correctly.
 * Run it after each phase: `node test-api.js`
 *
 * Prerequisites:
 * - API must be running (npm run dev)
 * - MongoDB must be connected
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let testTaskId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

/**
 * Make HTTP requests to the API
 */
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
          headers: res.headers,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Test helper to log results
 */
function test(name, passed, details = '') {
  const status = passed
    ? `${colors.green}✓ PASS${colors.reset}`
    : `${colors.red}✗ FAIL${colors.reset}`;

  console.log(`${status} - ${name}`);
  if (details) {
    console.log(`  ${colors.yellow}→${colors.reset} ${details}`);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║  TaskForge API - Automated Test Suite  ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  try {
    // ==================== PHASE 1: AUTH ====================
    console.log(`${colors.blue}Phase 1: Authentication${colors.reset}`);
    console.log('─'.repeat(40));

    // Test 1: Register
    try {
      const uniqueEmail = `user-${Date.now()}@test.com`;
      const registerRes = await makeRequest('POST', '/api/auth/register', {
        name: 'Test User',
        email: uniqueEmail,
        password: 'TestPassword123!',
      });

      if (registerRes.status === 201 && registerRes.body.token) {
        authToken = registerRes.body.token;
        test('Register - Create new user', true, `Status: ${registerRes.status}`);
        passed++;
      } else {
        test('Register - Create new user', false, `Status: ${registerRes.status}`);
        failed++;
      }
    } catch (error) {
      test('Register - Create new user', false, error.message);
      failed++;
    }

    // Test 2: Login
    try {
      const loginRes = await makeRequest('POST', '/api/auth/login', {
        email: 'john@example.com',
        password: 'SecurePassword123!',
      });

      if (loginRes.status === 200 && loginRes.body.token) {
        test('Login - Get auth token', true, `Status: ${loginRes.status}`);
        passed++;
      } else {
        test('Login - Get auth token', false, `Status: ${loginRes.status}`);
        failed++;
      }
    } catch (error) {
      test('Login - Get auth token', false, error.message);
      failed++;
    }

    // ==================== PHASE 2: TASK CREATION ====================
    console.log(`\n${colors.blue}Phase 2: Task CRUD Operations${colors.reset}`);
    console.log('─'.repeat(40));

    // Test 3: Create Task
    try {
      const createRes = await makeRequest(
        'POST',
        '/api/tasks',
        {
          title: 'Test Task ' + Date.now(),
          description: 'Testing the API',
          status: 'pending',
          dueDate: '2026-12-31',
        },
        { Authorization: `Bearer ${authToken}` }
      );

      if (createRes.status === 201 && createRes.body._id) {
        testTaskId = createRes.body._id;
        test('Create Task - POST /api/tasks', true, `Status: ${createRes.status}`);
        passed++;
      } else {
        test('Create Task - POST /api/tasks', false, `Status: ${createRes.status}`);
        failed++;
      }
    } catch (error) {
      test('Create Task - POST /api/tasks', false, error.message);
      failed++;
    }

    // Test 4: Get All Tasks
    try {
      const getRes = await makeRequest('GET', '/api/tasks', null, {
        Authorization: `Bearer ${authToken}`,
      });

      if (getRes.status === 200 && Array.isArray(getRes.body)) {
        test('Get All Tasks - GET /api/tasks', true, `Status: ${getRes.status}, Found: ${getRes.body.length} tasks`);
        passed++;
      } else {
        test('Get All Tasks - GET /api/tasks', false, `Status: ${getRes.status}`);
        failed++;
      }
    } catch (error) {
      test('Get All Tasks - GET /api/tasks', false, error.message);
      failed++;
    }

    // Test 5: Get Task by ID
    if (testTaskId) {
      try {
        const getRes = await makeRequest('GET', `/api/tasks/${testTaskId}`, null, {
          Authorization: `Bearer ${authToken}`,
        });

        if (getRes.status === 200 && getRes.body._id) {
          test('Get Task by ID - GET /api/tasks/:id', true, `Status: ${getRes.status}`);
          passed++;
        } else {
          test('Get Task by ID - GET /api/tasks/:id', false, `Status: ${getRes.status}`);
          failed++;
        }
      } catch (error) {
        test('Get Task by ID - GET /api/tasks/:id', false, error.message);
        failed++;
      }
    }

    // Test 6: Update Task
    if (testTaskId) {
      try {
        const updateRes = await makeRequest(
          'PUT',
          `/api/tasks/${testTaskId}`,
          {
            status: 'in-progress',
            description: 'Updated description',
          },
          { Authorization: `Bearer ${authToken}` }
        );

        if (updateRes.status === 200 && updateRes.body.status === 'in-progress') {
          test('Update Task - PUT /api/tasks/:id', true, `Status: ${updateRes.status}`);
          passed++;
        } else {
          test('Update Task - PUT /api/tasks/:id', false, `Status: ${updateRes.status}`);
          failed++;
        }
      } catch (error) {
        test('Update Task - PUT /api/tasks/:id', false, error.message);
        failed++;
      }
    }

    // ==================== PHASE 3: ADVANCED FEATURES ====================
    console.log(`\n${colors.blue}Phase 3: Advanced Features${colors.reset}`);
    console.log('─'.repeat(40));

    // Test 7: Filtering
    try {
      const filterRes = await makeRequest('GET', '/api/tasks?status=pending', null, {
        Authorization: `Bearer ${authToken}`,
      });

      if (filterRes.status === 200 && Array.isArray(filterRes.body)) {
        test('Filtering - GET /api/tasks?status=pending', true, `Status: ${filterRes.status}`);
        passed++;
      } else {
        test('Filtering - GET /api/tasks?status=pending', false, `Status: ${filterRes.status}`);
        failed++;
      }
    } catch (error) {
      test('Filtering - GET /api/tasks?status=pending', false, error.message);
      failed++;
    }

    // Test 8: Pagination
    try {
      const paginateRes = await makeRequest('GET', '/api/tasks?page=1&limit=5', null, {
        Authorization: `Bearer ${authToken}`,
      });

      if (paginateRes.status === 200) {
        test('Pagination - GET /api/tasks?page=1&limit=5', true, `Status: ${paginateRes.status}`);
        passed++;
      } else {
        test('Pagination - GET /api/tasks?page=1&limit=5', false, `Status: ${paginateRes.status}`);
        failed++;
      }
    } catch (error) {
      test('Pagination - GET /api/tasks?page=1&limit=5', false, error.message);
      failed++;
    }

    // ==================== PHASE 4: ERROR HANDLING ====================
    console.log(`\n${colors.blue}Phase 4: Error Handling & Validation${colors.reset}`);
    console.log('─'.repeat(40));

    // Test 9: No Auth Token
    try {
      const noAuthRes = await makeRequest('GET', '/api/tasks');

      if (noAuthRes.status === 401) {
        test('No Auth Token - Should return 401', true, `Status: ${noAuthRes.status}`);
        passed++;
      } else {
        test('No Auth Token - Should return 401', false, `Status: ${noAuthRes.status}, Expected: 401`);
        failed++;
      }
    } catch (error) {
      test('No Auth Token - Should return 401', false, error.message);
      failed++;
    }

    // Test 10: Missing Required Field
    try {
      const invalidRes = await makeRequest(
        'POST',
        '/api/tasks',
        {
          description: 'No title provided',
          status: 'pending',
        },
        { Authorization: `Bearer ${authToken}` }
      );

      if (invalidRes.status === 400) {
        test('Validation - Missing required field', true, `Status: ${invalidRes.status}`);
        passed++;
      } else {
        test('Validation - Missing required field', false, `Status: ${invalidRes.status}, Expected: 400`);
        failed++;
      }
    } catch (error) {
      test('Validation - Missing required field', false, error.message);
      failed++;
    }

    // Test 11: Invalid Status Enum
    try {
      const invalidStatusRes = await makeRequest(
        'POST',
        '/api/tasks',
        {
          title: 'Test',
          status: 'invalid-status',
        },
        { Authorization: `Bearer ${authToken}` }
      );

      if (invalidStatusRes.status === 400) {
        test('Validation - Invalid status enum', true, `Status: ${invalidStatusRes.status}`);
        passed++;
      } else {
        test('Validation - Invalid status enum', false, `Status: ${invalidStatusRes.status}, Expected: 400`);
        failed++;
      }
    } catch (error) {
      test('Validation - Invalid status enum', false, error.message);
      failed++;
    }

    // Test 12: Delete Task
    if (testTaskId) {
      try {
        const deleteRes = await makeRequest('DELETE', `/api/tasks/${testTaskId}`, null, {
          Authorization: `Bearer ${authToken}`,
        });

        if (deleteRes.status === 200 || deleteRes.status === 204) {
          test('Delete Task - DELETE /api/tasks/:id', true, `Status: ${deleteRes.status}`);
          passed++;
        } else {
          test('Delete Task - DELETE /api/tasks/:id', false, `Status: ${deleteRes.status}`);
          failed++;
        }
      } catch (error) {
        test('Delete Task - DELETE /api/tasks/:id', false, error.message);
        failed++;
      }
    }

    // ==================== SUMMARY ====================
    console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║            Test Summary                ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}`);
    console.log(`\n${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    console.log(`Total:  ${passed + failed}\n`);

    if (failed === 0) {
      console.log(`${colors.green}✓ All tests passed! Your API is working correctly.${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}✗ Some tests failed. Check your implementation.${colors.reset}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.red}✗ Test suite error: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests();
