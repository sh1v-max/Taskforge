# TaskForge API - What You've Implemented So Far

You have successfully built a highly robust authentication and user management system. Let's break down exactly what you've implemented, how it works, and look at the code examples that power it.

## 1. Project Architecture (MVC Pattern)
You've organized your code using a modular architecture based on the Model-View-Controller (MVC) pattern, minus the "View" since this is an API. 

*   **`models/`**: Defines the database schema.
*   **`controllers/`**: Contains the core business logic (e.g., what happens when someone registers).
*   **`routes/`**: Maps URLs (like `/api/auth/register`) to their respective controllers.
*   **`middleware/`**: Code that runs *between* receiving a request and executing the controller (e.g., checking if a user is logged in, or validating data).
*   **`schemas/`**: Defines validation rules using Zod.

---

## 2. The User Model & Secure Passwords
*(Location: `src/models/User.js`)*

You created a Mongoose schema that dictates how a user looks in MongoDB. But the smartest thing you did here was implementing **password hashing at the model level**.

### How it works:
Before Mongoose saves a user to the database, it triggers a `pre('save')` hook. This intercepts the raw password and converts it into an unreadable hash using `bcryptjs`. 

```javascript
// From your User.js
userSchema.pre('save', async function () {
  // Only hash if the password was modified (or is new)
  if (!this.isModified('password')) return

  // Generate a 'salt' (random data added to make hashes unique)
  const salt = await bcrypt.genSalt(10)
  
  // Replace the plain text password with the hashed version
  this.password = await bcrypt.hash(this.password, salt)
})
```
**Why this is great:** Even if a hacker accesses your MongoDB database, they won't be able to see the users' actual passwords.

---

## 3. Request Validation with Zod
*(Location: `src/schemas/auth.schema.js` & `src/middleware/validate.js`)*

You implemented a strict data validation layer. Instead of cluttering your controllers with `if (!req.body.email) ...`, you used **Zod**.

### How it works:
You defined exactly what a valid registration request looks like:
```javascript
// From auth.schema.js
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
```
Then, you built a custom middleware (`validate.js`) that sits in your router. When a user sends data to `/register`, the middleware checks the data against the `registerSchema`. If it fails, the middleware blocks the request and sends a `400 Bad Request` back immediately. If it passes, it forwards the clean data to your controller.

---

## 4. Authentication Controllers (Register & Login)
*(Location: `src/controllers/auth.controller.js`)*

This is where the magic happens for onboarding users. 

### The Login Flow Example:
When a user tries to log in, your code does the following:
1.  **Finds the user:** `const user = await User.findOne({ email });`
2.  **Checks the password:** It uses the custom method you wrote in your User model to compare the entered password with the hashed password.
    ```javascript
    const isMatch = await user.comparePassword(password);
    ```
3.  **Security Best Practice:** If the email doesn't exist, OR the password doesn't match, you return the **exact same error**: `"Invalid credentials"`. You implemented this perfectly! This prevents hackers from knowing if an email exists in your system.
4.  **Generates a Token:** If successful, it calls `generateToken(user._id)` to create a JSON Web Token (JWT).

---

## 5. JWT Generation & Route Protection (Middleware)
*(Location: `src/utils/generateToken.js` & `src/middleware/auth.middleware.js`)*

Because HTTP is "stateless" (it forgets who you are after every request), you need a way to keep users logged in. You implemented **JSON Web Tokens (JWT)**.

### How it works:
When a user logs in, they get a token. For all future requests, they must send this token in the `Authorization` header as a `Bearer` token.

Your `protect` middleware is the gatekeeper. 
```javascript
// Simplified logic from your auth.middleware.js
export const protect = async (req, res, next) => {
    // 1. Grab the token from the headers
    token = req.headers.authorization.split(' ')[1]
    
    // 2. Decode the token to see who it belongs to
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 3. Find the user in the database, excluding their password
    const user = await User.findById(decoded.id).select('-password')
    
    // 4. Attach the user to the request object!
    req.user = user
    
    // 5. Let them pass to the controller
    next()
}
```

**The brilliance of `req.user = user`:** By attaching the verified user to the `req` object, any controller that runs after this middleware immediately knows *exactly* who is making the request. You will use `req.user.id` extensively when we start building the Task controllers to ensure users only see their own tasks!

---

### Summary of the Request Flow you Built:

1. **Client** sends POST to `/api/auth/register`.
2. **`validate.js` Middleware** intercepts it and checks if the data matches `registerSchema`.
3. If valid, the **`register` Controller** takes over. It checks if the email is taken.
4. If not taken, it tells **Mongoose** to save the user.
5. The **`User.js` Model `pre('save')` hook** pauses the save, hashes the password, and resumes saving.
6. The Controller generates a **JWT** and sends a success response back to the client.
