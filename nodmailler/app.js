const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD, META_MAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.ua",
  port: 465, //25,465,2255
  secure: true,
  auth: {
    user: META_MAIL,
    pass: META_PASSWORD,
  },
};

const tranporter = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "cecicig976@mxclip.com",
  from: META_MAIL,
  subject: "New contact",
  html: "<p> У Вас новый контакт</p>",
};

tranporter
  .sendMail(email)
  .then(() => console.log("Email send seccuess"))
  .catch((error) => {
    console.log(error.message);
  });
