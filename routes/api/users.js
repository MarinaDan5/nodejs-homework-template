const express = require("express");

const { User } = require("../../model");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.body;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res) => {
  const { email } = req.user;
  res.json({ email });
});

module.exports = router;
