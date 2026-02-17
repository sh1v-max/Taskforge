import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  )
}

export default generateToken

// what does this function do?
// this function generate a JSON web token (jwt) for a given user ID
// it takes the user id as an argument and returns a signed token that includes the user id in its payload
// the token is signed using a secret key from the environment variables and is set to expire in 7 days

