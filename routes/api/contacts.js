const express = require('express')
const router = express.Router()

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
} = require('../../model/index')

router.get('/', async (req, res, next) => {
  const data = await listContacts()
  // console.log("data: ", data);
  res.json({
    status: 'success',
    code: 200,
    data
  })
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const data = await getContactById(contactId)
  if (!data) {
    res
      .status(404)
      .json({ message: `Not correct contact with id '${contactId}` })
  }
  res.json({
    status: 'success',
    code: 200,
    data
  })
})

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body
  const data = await addContact(name, email, phone)
  res.status(201).json({
    status: 'success',
    code: 201,
    data
  })
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  try {
    await removeContact(contactId)
    res.status(201).json({
      status: 'success',
      code: 201,
      message: `contact '${contactId}' deleted`
    })
  } catch {
    res.status(404).json({
      message: 'Not found'
    })
  }
})

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const { name, email, phone } = req.body
  try {
    await updateContact(contactId, name, email, phone)
    res.status(201).json({
      status: 'success',
      code: 201,
      message: `contact '${contactId}' changed`
    })
  } catch {
    res.status(404).json({
      message: 'Not found'
    })
  }
})

module.exports = router
