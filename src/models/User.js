import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
    // this will create createdAt and updatedAt fields automatically
  },
)

// now we will hash the password before saving the user to the database
// this runs automatically after every .save(), and .create()
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
// this refers to the current user document being saved

// now we will compare the password with the hashed password in the database when the user tries to login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// this compare with hashed password
// bcrypt handles hashing logic internally

const User = mongoose.model('User', userSchema)
// creating user model, now we can use it to create, update, delete, and find users
// User.create({ name: 'John Doe', email: [EMAIL_ADDRESS]', password: 'password' })
// User.find()
// User.findById(id)
// User.updateOne({ _id: id }, { name: 'John Doe' })
// User.deleteOne({ _id: id })

export default User

// this user models have schema, validations rules, password hashing, and compare method

// example user document stored in mongodb
// {
//   _id: ObjectId("..."),
//   name: "John Doe",
//   email: "[EMAIL_ADDRESS]",
//   password: "hashed_password",
//   role: "user",
//   createdAt: "2023-01-01T00:00:00.000Z",
//   updatedAt: "2023-01-01T00:00:00.000Z"
// }

// registration flow
// User sends name/email/password
//         ↓
// User.create()
//         ↓
// pre('save') hook runs
//         ↓
// Password hashed
//         ↓
// Document saved to MongoDB

// login flow
// User enters email/password
//         ↓
// User.findOne({ email })
//         ↓
// user.comparePassword(password)
//         ↓
// true / false