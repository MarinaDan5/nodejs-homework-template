const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const email = {
  to: "cecicig976@mxclip.com",
  from: "nulla.ante@vestibul.co.uk",
  subject: "New contact",
  html: "<p> У Вас новый контакт</p>",
};

sgMail
  .send(email)
  .then(() => console.log("Email send success"))
  .catch((error) => console.log(error.message));
