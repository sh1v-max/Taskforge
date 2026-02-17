export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((issue) => issue.message),
    })
  }

  req.body = result.data
  next()
}


// what does this middleware do?
// this takes a zod schema as an argument and returns a middleware function
// the middleware function validates the request body against the provided schema
// if the validation fails, it returns a 400 status code with the validation errors
// if the validation succeeds, it replaces the request body with the validated data and calls the next middleware or route handler