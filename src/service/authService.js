const bcrypt = require('bcrypt') //
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs').promises
const jimp = require('jimp')

const { User } = require('../db/userModel')
const {
  NotAuthorized,
  RegistrationConflictError
} = require('../helpers/errors')

const registration = async ({ email, password }) => {
  const existEmail = await User.findOne({ email })
  if (existEmail) {
    throw new RegistrationConflictError('Email  is already used')
  }
  const user = new User({
    email,
    password
  })
  const newUser = await user.save()
  return {
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL
  }
}

const login = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotAuthorized('Email  is wrong')
  }
  if (!(await bcrypt.compare(password, user.password))) {
    // if (!(password === user.password)) { //
    throw new NotAuthorized('Password is wrong')
  }
  const token = jwt.sign(
    {
      _id: user._id,
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

const logout = async ({ userId, token }) => {
  const logoutUser = await User.findOneAndUpdate(
    { _id: userId, token },
    { $set: { token: null } },
    { new: true }
  )
  if (!logoutUser) {
    throw new NotAuthorized('Not authorized')
  }
}

const getCurrentUser = async ({ userId, token }) => {
  const currentUser = await User.findOne({ _id: userId, token })
  return currentUser
}

const updateSubscription = async ({ token, subscription }, userId) => {
  const updateUserSubscription = await User.findByIdAndUpdate(
    { _id: userId, token },
    { $set: { subscription } },
    { new: true }
  )
  if (!updateUserSubscription) {
    throw new NotAuthorized('Not authorized')
  }
  return updateUserSubscription
}
const updateAvatar = async ({ userId, file }) => {
  const FILE_DIR = path.join(`./tmp/${file.filename}`)
  // console.log('FILE_DIR', FILE_DIR)
  const AVATARS_DIR = path.join('./public/avatars')
  // console.log('AVATARS_DIR', AVATARS_DIR)
  const [, extension] = file.originalname.split('.')
  const newImageName = `${Date.now()}.${extension}`
  if (file) {
    const avatars = await jimp.read(FILE_DIR)
    await avatars
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(FILE_DIR)
    await fs.rename(FILE_DIR, path.join(AVATARS_DIR, newImageName))
  }
  const newFilePath = `/api/download/${newImageName}`
  const newA = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { avatarURL: newFilePath } },
    { new: true }
  )
  return newA.avatarURL
}

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar
}
