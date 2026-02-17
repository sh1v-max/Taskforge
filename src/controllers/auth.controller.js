import User from '../models/User.js'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'user already exists',
      })
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    res.status(201).json({
      message: 'user registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// what does this controller do?
// this controller handles user registration
// it takes the name, email, and password from the request body
// it checks if a user with the same email already exists in the database
// if a user already exists, it returns a 400 status code with an error message
// if the user does not exist, it creates a new user in the database
// after creating the user, it returns a 201 status code with a success message and the user details (excluding the password)