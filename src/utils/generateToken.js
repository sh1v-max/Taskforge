import jwt from 'jsonwebtoken'

// what does this function do?
// this function generate a JSON web token (jwt) for a given user ID
// it takes the user id as an argument and returns a signed token that includes the user id in its payload
// the token is signed using a secret key from the environment variables and is set to expire in 7 days
const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    },
  )
}

export default generateToken

// this function returns an object, in which there is only the id of the user
// example: {
//   id: '69158a9530913af476714c53',
//   iat: 1747163157,
//   exp: 1749755157
// }