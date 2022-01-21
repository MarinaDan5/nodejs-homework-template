const fs = require("fs/promises");

const contactsPath = require("./contactsPath");

const getAll = async () => {
  const data = await fs.readFile(contactsPath);
  const products = JSON.parse(data);
  return products;
};

module.exports = getAll;
