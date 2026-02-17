import express from 'express'
import { register } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { registerSchema } from '../schemas/auth.schema.js'

const router = express.Router()

router.post('/register', validate(registerSchema), register)

export default router

// what does this route do?
// this route handles user registration
// it defines a POST endpoint at /register
// it uses the validate middleware to validate the request body against the registerSchema
// if the validation passes, it calls the register controller to handle the registration logic