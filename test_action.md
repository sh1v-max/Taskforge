# TaskForge API - Testing Action Guide

**Purpose:** Complete testing workflow for Steps 1-13
**Date:** 2026-06-23
**Status:** Ready to test all implemented features

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Setup Requirements](#setup-requirements)
3. [Testing Process](#testing-process)
4. [Expected Results](#expected-results)
5. [Troubleshooting](#troubleshooting)
6. [Next Steps](#next-steps)

---

## 🚀 Quick Start

**You need 2 terminals open at the same time:**

### Terminal 1: Start Server
```bash
cd e:\Full-Stack\BackendProjects\02-TaskForge-API
npm run dev
```

### Terminal 2: Run Tests
```bash
cd e:\Full-Stack\BackendProjects\02-TaskForge-API
node test-api.js
```

---

## 📋 Setup Requirements

### Prerequisites

- ✅ Node.js installed
- ✅ MongoDB running (local or Atlas)
- ✅ 2 terminal windows open
- ✅ All Steps 1-13 completed and committed
- ✅ test-api.js file exists

### Verify Files Exist

```bash
# Check these files exist:
ls src/app.js
ls src/models/Task.js
ls src/schemas/task.schema.js
ls src/controllers/task.controller.js
ls src/routes/task.router.js
ls src/middleware/validate.middleware.js
ls test-api.js
```

All should return file paths without errors.

---

## 🧪 Testing Process

### Step 1: Start the Server (Terminal 1)

**Command:**
```bash
cd e:\Full-Stack\BackendProjects\02-TaskForge-API
npm run dev
```

**What happens:**
- Nodemon starts the server
- Watches for file changes
- Automatically restarts on changes

**Expected output:**
```
[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
[nodemon] starting `node server.js`
Server running on port 5000
```

**Verification:**
- ✅ No errors in terminal
- ✅ Server running on port 5000
- ✅ Ready for requests

**What to do if it fails:**
- Check MongoDB is running: `mongosh`
- Check port 5000 is free
- Check .env file has valid MONGO_URI
- See Troubleshooting section below

---

### Step 2: Run Automated Tests (Terminal 2)

**Important:** Keep Terminal 1 running!

**Command:**
```bash
cd e:\Full-Stack\BackendProjects\02-TaskForge-API
node test-api.js
```

**What happens:**
- Test script connects to running API
- Tests authentication (register, login)
- Tests all CRUD operations
- Tests advanced features (filtering, pagination)
- Tests error cases (401, 400, 404)
- Shows summary of results

**Time to complete:** 5-10 seconds

---

## ✅ Expected Results

### Success Output

If all tests pass, you'll see:

```
╔════════════════════════════════════════╗
║  TaskForge API - Automated Test Suite  ║
╚════════════════════════════════════════╝

Phase 1: Authentication
────────────────────────────────────────
✓ PASS - Register - Create new user
  → Status: 201
✓ PASS - Login - Get auth token
  → Status: 200

Phase 2: Task CRUD Operations
────────────────────────────────────────
✓ PASS - Create Task - POST /api/tasks
  → Status: 201
✓ PASS - Get All Tasks - GET /api/tasks
  → Status: 200, Found: 1 tasks
✓ PASS - Get Task by ID - GET /api/tasks/:id
  → Status: 200
✓ PASS - Update Task - PUT /api/tasks/:id
  → Status: 200
✓ PASS - Delete Task - DELETE /api/tasks/:id
  → Status: 200

Phase 3: Advanced Features
────────────────────────────────────────
✓ PASS - Filtering - GET /api/tasks?status=pending
  → Status: 200
✓ PASS - Pagination - GET /api/tasks?page=1&limit=5
  → Status: 200

Phase 4: Error Handling & Validation
────────────────────────────────────────
✓ PASS - No Auth Token - Should return 401
  → Status: 401
✓ PASS - Validation - Missing required field
  → Status: 400
✓ PASS - Validation - Invalid status enum
  → Status: 400

╔════════════════════════════════════════╗
║            Test Summary                ║
╚════════════════════════════════════════╝

Passed: 12
Failed: 0
Total:  12

✓ All tests passed! Your API is working correctly.
```

**What this means:**
- ✅ All 12 tests passed
- ✅ 0 failures
- ✅ API is fully functional
- ✅ Ready for next steps

---

### Test Breakdown

#### Phase 1: Authentication (2 tests)

| Test | Purpose | Status Code |
|------|---------|-------------|
| Register | Create new user | 201 |
| Login | Get JWT token | 200 |

**What it tests:**
- User registration works
- JWT token generation works
- Login with credentials works

---

#### Phase 2: Task CRUD Operations (5 tests)

| Test | Purpose | Status Code |
|------|---------|-------------|
| Create Task | POST new task | 201 |
| Get All Tasks | GET user's tasks | 200 |
| Get Task by ID | GET single task | 200 |
| Update Task | PUT modify task | 200 |
| Delete Task | DELETE remove task | 200 |

**What it tests:**
- Task creation works
- Reading all tasks works
- Reading single task works
- Updating task works
- Deleting task works
- User ownership is enforced

---

#### Phase 3: Advanced Features (2 tests)

| Test | Purpose | Status Code |
|------|---------|-------------|
| Filtering | GET with ?status=pending | 200 |
| Pagination | GET with ?page=1&limit=5 | 200 |

**What it tests:**
- Filtering by status works
- Pagination returns correct data
- Query parameter validation works

---

#### Phase 4: Error Handling & Validation (3 tests)

| Test | Purpose | Status Code |
|------|---------|-------------|
| No Auth Token | Missing token | 401 |
| Missing Field | Invalid data | 400 |
| Invalid Enum | Bad status value | 400 |

**What it tests:**
- Auth middleware blocks unauthorized access
- Validation rejects incomplete data
- Validation rejects invalid enum values

---

## 🚨 Troubleshooting

### Issue 1: "Connection refused" Error

**Symptom:**
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**Cause:** Server not running

**Solution:**
1. Go to Terminal 1
2. Run: `npm run dev`
3. Wait for "Server running on port 5000"
4. Go back to Terminal 2
5. Run tests again

---

### Issue 2: "MongoDB connection error"

**Symptom:**
```
MongooseError: Cannot connect to MongoDB
```

**Cause:** MongoDB not running

**Solution:**

**For local MongoDB:**
```bash
# Windows - Check if MongoDB is running
mongosh

# If fails, start MongoDB service
# Or use: mongod
```

**For MongoDB Atlas (Cloud):**
1. Check .env has correct MONGO_URI
2. Verify credentials are correct
3. Check IP whitelist includes your IP

---

### Issue 3: "Port 5000 already in use"

**Symptom:**
```
Error: listen EADDRINUSE :::5000
```

**Cause:** Something else using port 5000

**Solution:**

```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the actual number)
taskkill /PID {PID} /F

# Then try npm run dev again
```

---

### Issue 4: Tests Timeout

**Symptom:**
```
Tests are running but never finish
```

**Cause:** Server not responding

**Solution:**
1. Check Terminal 1 for errors
2. Verify MongoDB is connected
3. Check for syntax errors in code
4. Try restarting server: `npm run dev`

---

### Issue 5: "403 Forbidden" or "Permission Denied"

**Symptom:**
```
Error: EACCES: permission denied
```

**Cause:** File permissions issue

**Solution:**
```bash
# Make test file executable (if needed)
chmod +x test-api.js

# Then run again
node test-api.js
```

---

### Issue 6: Some Tests Fail

**Symptom:**
```
✗ FAIL - Create Task
  → Status: 400
```

**Cause:** Usually validation or database issue

**Solution:**
1. Check error message in test output
2. Look at Terminal 1 for server errors
3. Verify data format matches schema
4. Check database connection
5. See test.md for detailed test information

---

## 🎯 What Each Test Actually Does

### Test: Register - Create New User

**Action:**
```
POST /api/auth/register
Body: {
  "name": "Test User",
  "email": "user-{timestamp}@test.com",
  "password": "TestPassword123!"
}
```

**Expected:**
- Status: 201 Created
- Response includes: token, user object
- User saved to MongoDB

**Why it matters:**
- Verifies authentication system works
- Verifies password hashing works
- Verifies JWT token generation works

---

### Test: Create Task

**Action:**
```
POST /api/tasks
Headers: Authorization: Bearer {token}
Body: {
  "title": "Test Task {timestamp}",
  "description": "Testing the API",
  "status": "pending",
  "dueDate": "2026-12-31"
}
```

**Expected:**
- Status: 201 Created
- Response includes: _id, title, user, createdAt
- Task saved to MongoDB
- Task assigned to logged-in user

**Why it matters:**
- Verifies task creation works
- Verifies user ownership is enforced
- Verifies validation works

---

### Test: Get All Tasks

**Action:**
```
GET /api/tasks
Headers: Authorization: Bearer {token}
```

**Expected:**
- Status: 200 OK
- Response: array of tasks
- Only user's own tasks returned

**Why it matters:**
- Verifies read operation works
- Verifies security (can't see others' tasks)
- Verifies data is correct

---

### Test: Update Task

**Action:**
```
PUT /api/tasks/{taskId}
Headers: Authorization: Bearer {token}
Body: {
  "status": "in-progress",
  "description": "Updated"
}
```

**Expected:**
- Status: 200 OK
- Response: updated task object
- Database reflects changes
- updatedAt timestamp changed

**Why it matters:**
- Verifies update operation works
- Verifies partial updates work
- Verifies user ownership check

---

### Test: Delete Task

**Action:**
```
DELETE /api/tasks/{taskId}
Headers: Authorization: Bearer {token}
```

**Expected:**
- Status: 200 OK
- Response: success message
- Task removed from database

**Why it matters:**
- Verifies delete operation works
- Verifies user ownership check
- Verifies data is actually removed

---

### Test: No Auth Token

**Action:**
```
GET /api/tasks
Headers: (NO Authorization header)
```

**Expected:**
- Status: 401 Unauthorized
- Error message in response

**Why it matters:**
- Verifies auth protection works
- Verifies can't access protected routes
- Verifies security is enforced

---

### Test: Invalid Data

**Action:**
```
POST /api/tasks
Headers: Authorization: Bearer {token}
Body: {
  "description": "No title provided",
  "status": "pending"
}
```

**Expected:**
- Status: 400 Bad Request
- Error shows: "title is required"

**Why it matters:**
- Verifies validation works
- Verifies invalid data is rejected
- Verifies error messages are helpful

---

## ✅ Success Criteria

**All tests pass if:**
- ✅ All 12 tests show "✓ PASS"
- ✅ 0 failures
- ✅ No error messages
- ✅ Summary shows: "All tests passed!"
- ✅ Exit code is 0

---

## 📊 Test Results Checklist

After running tests, verify:

### Authentication
- [ ] Register returns 201
- [ ] Token is valid JWT
- [ ] Login returns 200

### CRUD Operations
- [ ] Create returns 201 with _id
- [ ] Get All returns 200 with array
- [ ] Get Single returns 200 with one task
- [ ] Update returns 200 with changed data
- [ ] Delete returns 200 with success message

### Advanced Features
- [ ] Filtering works (?status=pending)
- [ ] Pagination works (?page=1&limit=5)

### Error Handling
- [ ] 401 without auth token
- [ ] 400 with invalid data
- [ ] Validation error messages are clear

### Data Integrity
- [ ] User ownership verified
- [ ] Can't see other users' tasks
- [ ] Can't modify other users' tasks
- [ ] Deleted tasks are gone

---

## 🎬 Step-by-Step Execution

### Detailed Timeline

**Minute 0:00 - Start Server**
```
Terminal 1: npm run dev
Wait for: "Server running on port 5000"
```

**Minute 0:05 - Run Tests**
```
Terminal 2: node test-api.js
Watch for: Test output starts appearing
```

**Minute 0:10 - Tests Complete**
```
Tests finish in ~5-10 seconds
Shows: Pass/fail summary
Exit code: 0 (success) or 1 (failure)
```

---

## 🔍 How to Read Test Output

### Color Codes

- 🟢 **Green** = PASS (test succeeded)
- 🔴 **Red** = FAIL (test failed)
- 🔵 **Blue** = Phase header
- ⚪ **White** = Details

### Format

```
✓ PASS - Test Name
  → Status: 200
  → Details: More information
```

### Example Good Output

```
✓ PASS - Create Task - POST /api/tasks
  → Status: 201
```

Means: Test passed, got 201 status (expected)

### Example Bad Output

```
✗ FAIL - Create Task - POST /api/tasks
  → Status: 400
```

Means: Test failed, got 400 status (unexpected)

---

## 📝 Recording Results

**After tests finish, record:**

1. **Date/Time:** When you ran tests
2. **Total Tests:** Should be 12
3. **Passed:** Should be 12
4. **Failed:** Should be 0
5. **Any errors:** Copy error messages

**Example:**
```
Date: 2026-06-23
Time: 14:30:00
Total: 12
Passed: 12
Failed: 0
Errors: None
Status: ✅ ALL TESTS PASSED
```

---

## 🚀 Next Steps After Testing

### If All Tests Pass ✅

Proceed to:
- Step 17: Create Global Error Handler Middleware
- Step 18: Refactor with Async Handler
- Step 19: Apply Rate Limiting
- Step 20: Swagger API Documentation

### If Some Tests Fail ❌

1. Check error message
2. Look at Troubleshooting section
3. Fix the issue
4. Run tests again
5. Verify all pass before proceeding

---

## 💡 Tips for Successful Testing

1. **Keep Terminal 1 Open**
   - Don't close server terminal
   - It helps with debugging

2. **Watch Server Output**
   - Server logs appear in Terminal 1
   - Shows requests and errors
   - Useful for debugging

3. **One Test at a Time**
   - If all fail, start fresh
   - Delete MongoDB data if needed
   - Re-run tests

4. **Check Internet**
   - For MongoDB Atlas users
   - Ensure connection is stable

5. **Use Fresh Data**
   - Each test run creates new user
   - No conflicts with old data

---

## 📞 Getting Help

**If tests fail:**

1. **Read the error message carefully**
   - Usually tells you exactly what's wrong

2. **Check Terminal 1 logs**
   - Server errors appear there

3. **Refer to test.md**
   - Detailed explanations of each test

4. **Check Troubleshooting section**
   - Common issues and solutions

5. **Verify prerequisites**
   - Server running?
   - MongoDB running?
   - Files exist?

---

## ✨ Summary

**Testing with test-api.js:**
- ✅ Tests 12 critical endpoints
- ✅ Takes ~5-10 seconds
- ✅ Shows immediate pass/fail results
- ✅ Great for quick verification
- ✅ Catches major issues fast

**Manual testing with Postman:**
- ✅ Detailed inspection of responses
- ✅ Test edge cases
- ✅ Verify exact response format
- ✅ See headers
- ✅ Test combinations of features

**Both methods combined:**
- ✅ Comprehensive testing coverage
- ✅ Catches all types of errors
- ✅ Full confidence in your API
- ✅ Ready for production

---

## 🎯 Final Checklist Before Next Step

Before moving to Step 17, verify:

- [ ] All 12 automated tests pass
- [ ] No error messages
- [ ] Server starts without issues
- [ ] MongoDB is connected
- [ ] Code is committed to git
- [ ] Code is pushed to GitHub

**Status:** ✅ Ready to proceed to Step 17!

---

**Good luck! Let me know if you need help! 🚀**
