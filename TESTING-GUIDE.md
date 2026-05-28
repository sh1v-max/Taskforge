# TaskForge API - Testing Guide

This guide explains **how to test your API** as you build it. We use three complementary approaches:

1. **Postman Collection** - Interactive testing, detailed inspection
2. **Automated Test Script** - Quick verification after each phase
3. **Manual curl/Browser** - Quick ad-hoc testing

---

## 🚀 Quick Start

### Setup (One-Time)

1. **Start the API:**
   ```bash
   npm run dev
   ```
   You should see: `Server running on port 5000`

2. **Import Postman Collection:**
   - Open Postman
   - File → Import → Select `TaskForge-API-Collection.json`
   - You now have all requests organized by phase

3. **Optional: Run automated tests**
   ```bash
   node test-api.js
   ```

---

## 📋 Testing by Phase

### Phase 1-2: Security & Setup
**After implementing:** CORS, Helmet middleware

**Quick Test:**
```bash
curl http://localhost:5000/api/health
```
Should get a response (200 or 404 is fine—proves server runs).

**Postman Test:**
- Click "Health Check"
- Send
- ✅ Should get a response

---

### Phase 3-4: Models & Controllers
**After implementing:** Task schema, CRUD controllers

**Postman Workflow:**
1. Click "Register" → Send → Copy token
2. Set `authToken` variable to the token
3. Click "Create Task" → Send → Copy returned `_id`
4. Set `taskId` variable to the ID
5. Click "Get Task by ID" → Send
6. Click "Update Task" → Send
7. Click "Delete Task" → Send

**Expected Results:**
- Register: 201 ✅
- Create: 201 ✅
- Get: 200 ✅
- Update: 200 ✅
- Delete: 200/204 ✅

**Automated Test:**
```bash
node test-api.js
```
Should pass Phase 1 & 2 tests.

---

### Phase 5-6: Routing & Advanced Features
**After implementing:** Routes, filtering, sorting, pagination

**Postman Tests:**

1. **Create 5+ test tasks** with different statuses/dates

2. **Test Filtering:**
   - Click "Get All Tasks - With Filter"
   - Change `?status=pending` to test different statuses
   - ✅ Should only return matching tasks

3. **Test Sorting:**
   - Click "Get All Tasks - With Sorting"
   - Try different `?sortBy=` values
   - ✅ Should return tasks in correct order

4. **Test Pagination:**
   - Click "Get All Tasks - With Pagination"
   - Try `?page=1&limit=5`, then `?page=2&limit=5`
   - ✅ Should return different subsets

5. **Test Combined:**
   - Click "Get All Tasks - COMBINED"
   - All features work together
   - ✅ Filtered, sorted, AND paginated

**Automated Test:**
```bash
node test-api.js
```
Should pass Phase 3 tests.

---

### Phase 7-8: Error Handling & Validation
**After implementing:** Error middleware, async-handler, rate limiting

**Postman Error Tests:**

1. **Test Auth Errors:**
   - Click "Test: No Authorization Token"
   - Send
   - ✅ Expected: 401 Unauthorized

2. **Test Validation Errors:**
   - Click "Test: Missing Required Field"
   - Send
   - ✅ Expected: 400 Bad Request

3. **Test Invalid Enum:**
   - Click "Test: Invalid Status Enum"
   - Send
   - ✅ Expected: 400 Bad Request

4. **Test 404 Errors:**
   - Click "Test: Invalid Task ID"
   - Send
   - ✅ Expected: 404 Not Found

5. **Test Rate Limiting (if implemented):**
   ```bash
   for i in {1..150}; do curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/tasks; done
   ```
   After ~100 requests: ✅ Should get 429 Too Many Requests

**Automated Test:**
```bash
node test-api.js
```
Should pass all tests.

---

## 🎯 When to Use Each Tool

| Scenario | Tool | Why |
|----------|------|-----|
| Quick verification after coding | `node test-api.js` | Fast, automated, shows all results |
| Detailed inspection of response | Postman | Visually inspect JSON, headers, timing |
| Testing specific edge case | Postman | Modify request, see exact response |
| Debugging a bug | Postman | Step through manually, inspect data |
| Before committing code | `node test-api.js` | Ensure all critical tests pass |
| Sharing test cases with team | Postman Collection | Organized, documented, reusable |
| Production smoke test | Bash script (curl) | Simple, doesn't require Node dependencies |

---

## 📝 Test Checklist by Phase

### After Phase 1-2 (Security)
- [ ] Server starts without errors
- [ ] API responds to requests (even if 404)

### After Phase 3-4 (Models & Controllers)
- [ ] Register creates a user
- [ ] Login returns a token
- [ ] Create Task returns 201 + task data
- [ ] Get All Tasks returns array
- [ ] Get Task by ID returns single task
- [ ] Update Task modifies the task
- [ ] Delete Task removes the task

### After Phase 5-6 (Routing & Advanced Features)
- [ ] Filtering works (`?status=pending`)
- [ ] Sorting works (`?sortBy=dueDate:asc`)
- [ ] Pagination works (`?page=1&limit=5`)
- [ ] Combined filtering + sorting + pagination works

### After Phase 7-8 (Error Handling)
- [ ] 401 when no auth token
- [ ] 400 when validation fails
- [ ] 404 when task not found
- [ ] Error responses are consistent JSON format
- [ ] 429 when rate limited (if implemented)

### After Phase 9 (API Documentation)
- [ ] Swagger UI loads at `/api-docs`
- [ ] All endpoints are documented
- [ ] Can execute requests from Swagger UI

---

## 🔧 Troubleshooting

**Test fails with "connection refused":**
- Ensure `npm run dev` is running
- Check port 5000 is available
- Try `curl http://localhost:5000/api/health`

**Test fails with "401 Unauthorized":**
- Register a new user first
- Copy the token to `authToken` variable in Postman
- Or update the test script with a valid token

**Test fails with "404 Not Found":**
- Endpoint might not be implemented yet
- Check that the route is wired in `app.js`
- Verify the path matches exactly

**Test fails with "400 Bad Request":**
- Validation is rejecting your data
- Check the error message in response body
- Fix the data (e.g., status must be "pending", not "pending123")

---

## 📊 Sample Test Output

Running `node test-api.js`:

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
  → Status: 200, Found: 5 tasks
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

---

## 💡 Tips for Effective Testing

1. **Test incrementally:** Don't wait until the end. Test after each step.
2. **Use environment variables:** In Postman, variables let you reuse values (token, taskId).
3. **Read error messages:** They tell you exactly what's wrong.
4. **Test both happy path and errors:** Create task ✅, then try creating without title ❌.
5. **Commit after tests pass:** This way you know each commit is working.
6. **Clean data:** Between test runs, delete tasks so you have fresh data.

---

## 📖 Next Steps

After all tests pass:
1. Run `node test-api.js` one final time
2. Commit: `git commit -m "Step X: [Feature] - All tests passing"`
3. Move to the next phase
4. Repeat!

Good luck! 🚀
