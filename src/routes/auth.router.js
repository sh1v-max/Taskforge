import express from 'express'
import { register } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { registerSchema } from '../schemas/auth.schema.js'
import { login } from '../controllers/auth.controller.js'
import { loginSchema } from '../schemas/auth.schema.js'

const router = express.Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)

export default router

// this router handles user registration and login
// it defines two routes: /register and /login
// for the /register route, it uses the validate middleware to validate the request body against the registerSchema before calling the register controller function
// for the /login route, it uses the validate middleware to validate the request body against the loginSchema before calling the login controller function

// validate middleware is a custom middleware that validates the request body against the provided schema
// registerSchema and loginSchema are zod schemas that define the structure and validation rules for the registration and login data respectively
