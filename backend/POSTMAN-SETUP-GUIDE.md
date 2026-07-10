# Postman Testing Guide - TaskForge API

Complete guide to test TaskForge API using Postman

---

## 📦 Step 1: Download Postman

1. Go to **https://www.postman.com/downloads/**
2. Choose your OS (Windows, Mac, Linux)
3. Install it
4. Create account (optional but recommended)

---

## 📥 Step 2: Import Collection

### Method 1: Import from File
1. Open Postman
2. Click **Import** button (top left)
3. Click **Upload Files**
4. Select: `TaskForge-API-Collection.postman_collection.json`
5. Click **Import**

### Method 2: Import from URL
1. Open Postman
2. Click **Import** button
3. Paste URL to raw GitHub link (if applicable)
4. Click **Import**

---

## ⚙️ Step 3: Set Environment Variables

After importing, you need to set the **BASE_URL** environment variable:

### Create Environment (Recommended)
1. Click **Environments** (left sidebar)
2. Click **+** to create new
3. Name it: `TaskForge - Local`
4. Set variable:
   - **Key:** `BASE_URL`
   - **Value:** `http://localhost:5000`
5. Click **Save**

### Select Environment
1. Top right, select **Environment** dropdown
2. Choose **TaskForge - Local**

**Note:** Other variables (JWT_TOKEN, USER_ID, TASK_ID) are filled automatically by tests.

---

## 🚀 Step 4: Start Testing

Make sure your server is running:
```bash
npm run dev
```

---

## 🧪 Complete Testing Flow

### Phase 1: Authentication ✅

**1. Run: Register - Create New User**
- Click on `1. Register - Create New User`
- Notice the email has `{{$timestamp}}` - creates unique emails
- Click **Send**
- You should see: **Status 201 Created**
- Token is automatically saved to `JWT_TOKEN` variable

✅ **Success indicators:**
```
✓ Status: 201 Created
✓ Response has: token, user, message
✓ JWT_TOKEN variable is populated
```

**2. Run: Login - Get JWT Token**
- Click on `2. Login - Get JWT Token`
- Click **Send**
- You should see: **Status 200 OK**
- A new token is saved (refreshes existing one)

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ Response has: token, user, message
✓ Can see "Login successful" message
```

---

### Phase 2: Create Tasks ✅

**3. Run: Create Task - Single Task**
- Click on `3. Create Task - Single Task`
- Review the request body (can edit if you want)
- Click **Send**
- Should see: **Status 201 Created**
- Task ID is automatically saved to `TASK_ID` variable

✅ **Success indicators:**
```
✓ Status: 201 Created
✓ Response has: _id, title, status, user, createdAt
✓ TASK_ID is populated for next requests
✓ status is "pending" as specified
```

**4. Run: Create Multiple Tasks - For Testing**
- Click on `4. Create Multiple Tasks - For Testing`
- This creates a different task (in-progress)
- Click **Send**
- Should see: **Status 201 Created**

✅ Create at least 2-3 tasks so you have data for filtering/sorting tests.

---

### Phase 3: Read Operations ✅

**5. Run: Get All Tasks**
- Click on `5. Get All Tasks`
- Click **Send**
- Should see: **Status 200 OK**
- Shows all your tasks with pagination info

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ Response has: tasks[], page, limit, total
✓ All tasks belong to your user (check "user" field)
✓ Each task has: _id, title, status, user, createdAt
```

**6. Run: Get Task by ID**
- Click on `6. Get Task by ID`
- Uses `{{TASK_ID}}` from step 3
- Click **Send**
- Should see: **Status 200 OK**
- Shows single task you created

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ Task ID matches TASK_ID variable
✓ Shows complete task object
```

---

### Phase 4: Update Operations ✅

**7. Run: Update Task**
- Click on `7. Update Task`
- Click **Send**
- Should see: **Status 200 OK**
- Task status changed to "completed"

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ status field is now "completed"
✓ description is updated
✓ updatedAt timestamp is newer
```

---

### Phase 5: Advanced Features ✅

**8. Run: Filter Tasks by Status - Pending**
- Click on `8. Filter Tasks by Status - Pending`
- Click **Send**
- Should see: **Status 200 OK**
- Returns only pending tasks

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ All returned tasks have status: "pending"
✓ Does NOT include "completed" tasks
```

**9. Run: Filter Tasks by Status - In-Progress**
- Click on `9. Filter Tasks by Status - In-Progress`
- Click **Send**
- Should see: **Status 200 OK**
- Returns only in-progress tasks

**10. Run: Sort Tasks by Due Date (Ascending)**
- Click on `10. Sort Tasks by Due Date (Ascending)`
- Click **Send**
- Should see: **Status 200 OK**
- Tasks are sorted earliest due date first

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ Tasks are ordered by dueDate
✓ Earliest due date comes first
```

**11. Run: Pagination - Page 1**
- Click on `11. Pagination - Page 1`
- Click **Send**
- Should see: **Status 200 OK**
- Returns only 5 tasks per page

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ page: 1
✓ limit: 5
✓ tasks array has max 5 items
```

---

### Phase 6: Error Handling ✅

These tests verify error handling works correctly.

**12. Run: Missing Auth Token**
- Click on `12. Missing Auth Token`
- Click **Send**
- Should see: **Status 401 Unauthorized**
- Error message about missing token

✅ **Success indicators:**
```
✓ Status: 401 Unauthorized
✓ Message indicates missing/invalid token
```

**13. Run: Invalid Token**
- Click on `13. Invalid Token`
- Uses intentionally bad token: `invalid.token.here`
- Click **Send**
- Should see: **Status 401 Unauthorized**

✅ **Success indicators:**
```
✓ Status: 401 Unauthorized
✓ Message: "Invalid token"
```

**14. Run: Missing Required Field (title)**
- Click on `14. Missing Required Field (title)`
- Request body has no "title" field
- Click **Send**
- Should see: **Status 400 Bad Request**

✅ **Success indicators:**
```
✓ Status: 400 Bad Request
✓ Response includes error details
✓ Indicates "title" is required
```

**15. Run: Invalid Status Enum**
- Click on `15. Invalid Status Enum`
- Uses invalid status: `invalid-status`
- Click **Send**
- Should see: **Status 400 Bad Request**

✅ **Success indicators:**
```
✓ Status: 400 Bad Request
✓ Error indicates enum validation failed
✓ Valid statuses are: pending, in-progress, completed
```

**16. Run: Task Not Found (Wrong ID)**
- Click on `16. Task Not Found (Wrong ID)`
- Uses fake ID: `507f1f77bcf86cd799999999`
- Click **Send**
- Should see: **Status 404 Not Found**

✅ **Success indicators:**
```
✓ Status: 404 Not Found
✓ Error: "Task not found"
```

---

### Phase 7: Cleanup ✅

**17. Run: Delete Task**
- Click on `17. Delete Task`
- Uses `{{TASK_ID}}` from step 3
- Click **Send**
- Should see: **Status 200 OK**
- Task is deleted permanently

✅ **Success indicators:**
```
✓ Status: 200 OK
✓ Message: "Task deleted successfully"
```

---

## 📊 Running Tests Automatically

Postman has built-in testing. Each request has test scripts that:
- Verify status codes
- Check response structure
- Validate data
- Save variables automatically

### View Test Results
1. After clicking **Send**, look for **Test Results** tab (bottom)
2. Shows which tests passed/failed
3. Green checkmark = Test passed
4. Red X = Test failed

### Run Entire Collection
1. Click on collection name (left sidebar)
2. Click **Run** (right side)
3. Select environment: **TaskForge - Local**
4. Click **Run TaskForge API**
5. All requests run in order
6. See results in new window

---

## 🔍 Understanding Responses

### Successful Response Example
```json
{
  "message": "user registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john1234567890@example.com",
    "role": "user"
  }
}
```

**What to look for:**
- ✅ Status: 200, 201, or 204 (success codes)
- ✅ Response body has expected fields
- ✅ Data types match (id is string, timestamps are ISO dates)

### Error Response Example
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "title is required"
    }
  ]
}
```

**What to look for:**
- ❌ Status: 400, 401, 404, 500 (error codes)
- ❌ Error message describes what went wrong
- ❌ Fields array shows which field failed validation

---

## 🛠️ Customizing Requests

Want to test with your own data? Easy!

**Example: Create Task with Custom Data**
1. Click on `3. Create Task - Single Task`
2. In the **Body** tab, change the JSON:
   ```json
   {
     "title": "Your custom title",
     "description": "Your custom description",
     "status": "pending",
     "dueDate": "2026-12-31T23:59:59Z"
   }
   ```
3. Click **Send**
4. See your custom data in response

---

## 📝 Common Issues & Solutions

### Issue: "BASE_URL is undefined"
**Solution:** 
1. Make sure you selected an environment
2. Environment must have `BASE_URL` variable set
3. Value should be: `http://localhost:5000`

### Issue: "401 Unauthorized" on protected routes
**Solution:**
1. Make sure you ran the **Register** or **Login** request first
2. Check that JWT_TOKEN variable is populated
3. The token automatically expires after 7 days

### Issue: "Cannot GET /api/tasks"
**Solution:**
1. Verify server is running: `npm run dev`
2. Check console output - should say "Server running on port 5000"
3. Make sure BASE_URL is correct: `http://localhost:5000`

### Issue: "ECONNREFUSED" error
**Solution:**
1. Server is not running
2. In project directory, run: `npm run dev`
3. Wait for "MongoDB connected" message
4. Then try Postman request again

---

## 🔐 Security Best Practices

**Postman Best Practices:**
- ✅ Don't share collection with API keys/tokens
- ✅ Use environment variables for sensitive data
- ✅ Set environment to **Local** when developing
- ✅ Never commit Postman exports with real tokens
- ✅ Use different tokens for dev/prod environments

---

## 📚 Collection Structure

```
TaskForge API Collection
├── 🔐 Authentication (2 requests)
│   ├── Register
│   └── Login
│
├── 📝 Task CRUD Operations (5 requests)
│   ├── Create Single Task
│   ├── Create Multiple Tasks
│   ├── Get All Tasks
│   ├── Get Task by ID
│   └── Update Task
│
├── 🔍 Advanced Features (4 requests)
│   ├── Filter by Status (Pending)
│   ├── Filter by Status (In-Progress)
│   ├── Sort by Due Date
│   └── Pagination
│
├── ❌ Error Scenarios (5 requests)
│   ├── Missing Auth Token
│   ├── Invalid Token
│   ├── Missing Required Field
│   ├── Invalid Status Enum
│   └── Task Not Found
│
└── 🗑️ Cleanup (1 request)
    └── Delete Task
```

---

## ✅ Testing Checklist

- [ ] Imported collection successfully
- [ ] Set BASE_URL to http://localhost:5000
- [ ] Registered a new user (Status 201)
- [ ] Logged in (Status 200)
- [ ] Created a task (Status 201)
- [ ] Retrieved all tasks (Status 200)
- [ ] Updated a task (Status 200)
- [ ] Filtered tasks by status (Status 200)
- [ ] Tested pagination (Status 200)
- [ ] Tested error scenarios (Status 4xx/5xx)
- [ ] Deleted a task (Status 200)
- [ ] All test results show green checks ✅

---

## 🎯 Next Steps

After testing with Postman:
1. ✅ Verify API works correctly
2. ✅ Understand all endpoints
3. ✅ See error handling in action
4. ✅ Confirm security (authentication, ownership)
5. → Ready to integrate with frontend!

---

## 📞 Need Help?

- **Postman Docs:** https://learning.postman.com/docs/getting-started/introduction/
- **API Docs:** Check `swagger_overview.md` for detailed API info
- **Server Issues:** Check `overview.md` → Troubleshooting section

---

**Happy Testing! 🚀**
