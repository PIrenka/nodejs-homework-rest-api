const {
  getContact,
  getContactById,
  deleteContact,
  addContact,
  updateContact,
  updateStatusContact
} = require('../model/contactService')

const getContactsController = async (req, res, next) => {
  const { _id: userId } = req.user
  const client = await getContact(userId)
  res.status(200).json({ client })
}
const getContactIdController = async (req, res, next) => {
  const { id } = req.params
  const { _id: userId } = req.user

  const client = await getContactById(id, userId)
  if (!client) {
    return res.status(404).json(`There are no client with ${id} in db!`)
  }
  return res.status(200).json({ client })
}

const postContactsController = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body
  const { _id: userId } = req.user
  const client = await addContact({ name, email, phone, favorite, userId })
  return res.status(200).json({ status: 'contact added', client })
}

const deleteContactController = async (req, res, next) => {
  const { id } = req.params
  const { _id: userId } = req.user
  await deleteContact(id, userId)
  res.status(200).json({
    status: 'deleted success'
  })
}

const updateContactController = async (req, res, next) => {
  const { id } = req.params
  const { _id: userId } = req.user
  const { name, email, phone } = req.body
  const client = await updateContact(id, { name, email, phone }, userId)
  if (client) {
    res.status(200).json(`client with ${id} update`)
  }
  res.status(404).json({
    message: `Not found client id: ${id}`,
    data: 'Not Found'
  })
}

const updateStatusContactController = async (req, res, next) => {
  const { id } = req.params
  const { _id: userId } = req.user
  const { favorite } = req.body
  const client = await updateStatusContact(id, { favorite }, userId)
  if (client) {
    return res.status(200).json(`client with ${id} update favorite status`)
  }
  return res.status(404).json({
    message: `Not found client id: ${id}`,
    data: 'Not Found'
  })
}

module.exports = {
  getContactsController,
  getContactIdController,
  postContactsController,
  deleteContactController,
  updateContactController,
  updateStatusContactController
}
