// this router handles user registration and login
// it defines two routes: /register and /login
// for the /register route, it uses the validate middleware to validate the request body against the registerSchema before calling the register controller function
// for the /login route, it uses the validate middleware to validate the request body against the loginSchema before calling the login controller function

// validate middleware is a custom middleware that validates the request body against the provided schema
// registerSchema and  loginSchema are zod schemas that define the structure and validation rules for the registration and login data respectively 

import express from 'express'
import { register } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { registerSchema } from '../schemas/auth.schema.js'
import { login } from '../controllers/auth.controller.js'
import { loginSchema } from '../schemas/auth.schema.js'
import { getMe, updateMe } from '../controllers/auth.controller.js'
import { updateProfileSchema } from '../schemas/auth.schema.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password. Password is automatically hashed before storing.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation failed or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validate(registerSchema), register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password. Returns JWT token on success.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validate(loginSchema), login)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get('/me', protect, getMe)

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Update the logged-in user's profile
 *     description: Update name and/or password. Changing password requires the current password.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Name
 *               currentPassword:
 *                 type: string
 *                 example: OldPass123!
 *               newPassword:
 *                 type: string
 *                 example: NewPass123!
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed or current password incorrect
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.put('/me', protect, validate(updateProfileSchema), updateMe)

export default router
