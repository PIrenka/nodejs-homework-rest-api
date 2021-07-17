const {
  login,
  registration,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar
} = require('../model/authService')

const registrationController = async (req, res, next) => {
  const { email, password } = req.body
  await registration({ email, password })
  res.status(201).json({ status: 'created' })
  // res.status(201).json({
  //   user: {
  //     email: email,
  //     password: password
  //   }
  // })
}

const loginController = async (req, res, next) => {
  const { email, password } = req.body
  const token = await login({ email, password })
  return res.status(200).json({ token })
}

const logoutController = async (req, res) => {
  const { userId } = req.user
  const token = req.token
  await logout({
    userId,
    token
  })

  res.status(204).json({ status: 'No Content' })
}

const getCurrentUserController = async (req, res, next) => {
  const token = req.token
  const { _id: userId } = req.user
  const currentUser = await getCurrentUser({ userId, token })
  return res.status(200).json({ currentUser })
}

const updateSubscriptionController = async (req, res, next) => {
  const token = req.token
  const { subscription } = req.body
  const { _id: userId } = req.user
  const currentUser = await updateSubscription({ token, subscription }, userId)
  res.status(200).json({ currentUser })
}

const avatarsController = async (req, res) => {
  const { userId } = req.user
  const pathAvatar = req.file.path
  console.log('pathAvatar', pathAvatar)
  const token = req.token
  const URLAvatar = await updateAvatar({
    userId,
    pathAvatar,
    token
  })

  res.status(200).json({
    Status: 'OK',
    ContentType: 'application/json',
    ResponseBody: { URLAvatar }
  })
}

module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController,
  avatarsController
}
