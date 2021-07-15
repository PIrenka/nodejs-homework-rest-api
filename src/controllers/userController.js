const { login, registration } = require('../service/authService')

const registrationController = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await registration({ email, password })
    res.status(200).json({ user })
  } catch (error) {
    res.status(400).json({ message: error.message })
    next(error)
  }
}
const loginController = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const token = await login({ email, password })
    res.status(200).json({ token })
  } catch (error) {
    res.status(400).json({ message: error.message })
    next(error)
  }
}

module.exports = {
  registrationController,
  loginController
}
