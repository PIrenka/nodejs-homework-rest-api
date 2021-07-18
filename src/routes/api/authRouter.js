const express = require('express')
const router = express.Router()

const {
  authorizationValidation,
  subscriptionValidation
} = require('../../middlewares/validation')
const { asyncWrapper } = require('../../helpers/apiHelpers')
const { authMiddleware } = require('../../middlewares/authMiddleware')
const { uploadMiddleware } = require('../../helpers/multer')

const {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController,
  avatarsController,
  userVerificationController,
  userVerificationResendController
} = require('../../controllers/userController')

router.post(
  '/registration',
  authorizationValidation,
  asyncWrapper(registrationController)
)
router.post('/login', authorizationValidation, asyncWrapper(loginController))
router.post('/logout', authMiddleware, asyncWrapper(logoutController))
router.get('/current', authMiddleware, asyncWrapper(getCurrentUserController))
router.patch(
  '/',
  authMiddleware,
  subscriptionValidation,
  asyncWrapper(updateSubscriptionController)
)
router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  asyncWrapper(avatarsController)
)
router.get(
  '/verify/:verificationToken',
  asyncWrapper(userVerificationController)
)
router.post('/verify', asyncWrapper(userVerificationResendController))

module.exports = router
