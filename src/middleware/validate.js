// what does this middleware does?
// this takes a zod schema as an argument and return a middleware function
// the middleware function validates the result body against the provided schema
// if the validation fails, it returns a 400 status code with the validation errors
// if the validation succeeds, it replaces the request body with the validated data and calls the next middleware handler

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => issue.message),
      })
    }

    req.body = result.data
    next()
  }
}

// valid input example
// input:
// {
//   "name": "Wazir",
//   "email": "WAZIR@gmail.com",
//   "password": "123456"
// }

// result:
// {
//   success: true,
//   data: {
//     name: "Wazir",
//     email: "wazir@gmail.com",
//     password: "123456"
//   }
// }

// invalid input example
// input:
// {
//   "name": "",
//   "email": "abc",
//   "password": "123"
// }

// result:
// {
//   success: false,
//   error: ...
// }

// request flow:
// Client sends request
//         ↓
// validate(registerSchema)
//         ↓
// safeParse(req.body)
//         ↓
// If invalid → return 400
//         ↓
// If valid → req.body = cleaned data
//         ↓
// next()
//         ↓
// Controller runs