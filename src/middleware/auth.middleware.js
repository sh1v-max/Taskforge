import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    let token

    // check if authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // check if token exists
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token',
      })
    }

    // verify token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // get user from decoded token and exclude password
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      })
    }

    // add user to request object for use in other routes
    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized, token failed',
    })
  }
}
