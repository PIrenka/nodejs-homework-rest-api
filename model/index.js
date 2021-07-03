const fs = require('fs/promises')
const path = require('path')
const contactsPath = path.join('./model/contacts.json')

const getListContact = () => {
  return fs.readFile(contactsPath, 'utf8')
}
const writeToJson = (data) => {
  return fs.writeFile(contactsPath, data)
}

const listContacts = async () => {
  try {
    const listContact = await getListContact()
    return JSON.parse(listContact)
  } catch (err) {
    console.log(err.message)
  }
}

const getContactById = async (contactId) => {
  try {
    const listContact = await getListContact()
    const contact = JSON.parse(listContact)
    const contactById = contact.find(({ id }) => id.toString() === contactId)
    return contactById
  } catch (err) {
    console.log(err.message)
  }
}

const removeContact = async (contactId) => {
  try {
    const listContact = await getListContact()
    const contact = JSON.parse(listContact)
    const idDeleteList = contact.filter(({ id }) => id.toString() !== contactId)
    const contactsList = JSON.stringify(idDeleteList)
    await writeToJson(contactsList)
    return idDeleteList
  } catch (err) {
    console.log(err.message)
  }
}

const addContact = async (name, email, phone) => {
  try {
    const listContact = await getListContact()
    const contact = JSON.parse(listContact)
    const contactNew = { id: new Date(), name, email, phone }
    const contactsList = JSON.stringify([contactNew, ...contact], null, '\t')

    await writeToJson(contactsList)
    return contactNew
  } catch (err) {
    console.log(err.message)
  }
}

const updateContact = async (contactId, name, email, phone) => {
  console.log(contactId, name, email, phone)
  try {
    const listContact = await getListContact()
    const contact = JSON.parse(listContact)

    contact.forEach((cont, index) => {
      if (cont.id.toString() === contactId) {
        contact[index] = { id: contactId, name, email, phone }
      }
    })

    const contactsList = JSON.stringify(contact, null, '\t')
    await writeToJson(contactsList)
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
}
