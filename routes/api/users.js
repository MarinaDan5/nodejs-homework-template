const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const { User } = require("../../model");
const { authenticate, upload } = require("../../middlewares");

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

module.exports = router;
