const express = require('express')
const router = express.Router()
const { asyncWrapper } = require('../../helpers/apiHelpers')

const {
  getContactsController,
  getContactIdController,
  postContactController,
  deleteContactController,
  updateContactController,
  updateStatusContactController
} = require('../../controllers/contactsController')
const {
  validationData,
  updateContactValidation,
  updateStatusContactValidation
} = require('../../middlewares/validation')
const { authMiddleware } = require('../../middlewares/authMiddleware')

router.use(authMiddleware)
router.get('/', asyncWrapper(getContactsController))
router.get('/:id', asyncWrapper(getContactIdController))
router.post('/', validationData, asyncWrapper(postContactController))
router.delete('/:id', asyncWrapper(deleteContactController))
router.put(
  '/:id',
  updateContactValidation,
  asyncWrapper(updateContactController)
)
router.patch(
  '/:id/favorite',
  updateStatusContactValidation,
  asyncWrapper(updateStatusContactController)
)

module.exports = router
