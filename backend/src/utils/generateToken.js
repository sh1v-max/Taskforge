import jwt from 'jsonwebtoken'

// 30 days with no refresh token or revocation: simple, but a leaked token
// stays valid until it expires. A short-lived access token plus a refresh
// token would fix that.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export default generateToken
