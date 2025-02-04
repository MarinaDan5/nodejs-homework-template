const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const { NotFound, BadRequest } = require("http-errors");
const { SITE_NAME } = process.env;

const { User } = require("../../model");
const { authenticate, upload } = require("../../middlewares");
const { sendEmail } = require("../../sendgrid/helpers");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.body;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res) => {
  const { email } = req.user;
  res.json({ email });
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newfileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newfileName);
    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newfileName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  }
);

router.get("/verify/:verificationToken", async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new NotFound("User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({ message: "Verification successful" });
  } catch (error) {}
});
router.post("/verify/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("missing required field email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound("User not found");
    }
    if (user.verify) {
      throw new BadRequest("Verification has already been passed");
    }
    const { verificationToken } = user;
    const data = {
      to: email,
      subject: "Подтверждение email",
      html: ` <a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Подтвердите email</a>`,
    };
    await sendEmail(data);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
