const fs = require("fs/promises");
const { v4 } = require("uuid");

const contactsPath = require("../routes/api/contacts/contactsPath");

const getAll = require("../routes/api/contacts/getAll");
const updateContacts = require("../routes/api/contacts/updateContacts");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (id) => {
  const contacts = await getAll();
  const result = contacts.find((item) => item.id === id);
  if (!result) {
    return null;
  }
  return result;
};

const removeContact = async (id) => {
  const contacts = await getAll();
  const idx = contacts.findIndex((item) => item.id === id);
  if (idx === -1) {
    return null;
  }
  const newContacts = contacts.filter((_, index) => index !== idx);
  await updateContacts(newContacts);
  return contacts[idx];
};

const addContact = async (body) => {
  const newContacts = { ...body, id: v4() };
  const products = await getAll();
  products.push(newContacts);
  await updateContacts(products);
  return newContacts;
};

const updateContact = async (id, body) => {
  const contacts = await getAll();
  const idx = contacts.findIndex((item) => item.id === id);
  if (idx === -1) {
    return null;
  }
  contacts[idx] = { ...body, id };
  await updateContacts(contacts);
  return contacts[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
