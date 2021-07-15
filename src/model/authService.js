const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../db/userModel')
const { NotAuthorized } = require('../helpers/errors')

const registration = async ({ email, password }) => {
  const newUser = new User({ email, password })
  return await newUser.save()
}
const login = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotAuthorized('Email  is wrong')
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotAuthorized('Password is wrong')
  }
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      subscription: user.subscription
    },
    process.env.JWT_SECRET
  )
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { token } },
    { new: true }
  )
  return updatedUser
}

module.exports = {
  login,
  registration
}
