const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const verifyToken = require("../middleware/auth");

const User = require("../Models/User");

// @route POST api/auth/register
// @desc Register User
// @access Public
router.post("/register", upload.single("image"), async (req, res) => {
  const { username, password, role, name } = req.body;

  try {
    //Check for exitsting user
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản đã được đăng ký" });

    //upload image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "UserImg",
    });

    //All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      name,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    });
    await newUser.save();

    res.json({
      success: true,
      message: "Tạo tài khoản thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

// @route POST api/auth/login
// @desc Login User
// @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // //Simple validation
  // if (!username || !password)
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Missing username and/or password" });

  try {
    //Check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });

    //Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });

    //All good
    //Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

// @route POST api/auth/changeimg
// @desc Login User
// @access Public
router.put(
  "/changeimg",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      let user = await User.findById(req.userId);
      await cloudinary.uploader.destroy(user.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "UserImg",
      });

      const data = {
        avatar: result.secure_url || user.avatar,
        cloudinary_id: result.public_id || user.cloudinary_id,
      };

      user = await User.findByIdAndUpdate(req.userId, data, { new: true });
      res.json({
        success: true,
        message: "Thay đổi ảnh thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
    }
  }
);

// @route POST api/auth/changepassword
// @desc Change Password
// @access Public
router.put(
  "/changepassword",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      let user = await User.findById(req.userId);

      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        return res.status(400).json({
          success: false,
          message: "Sai mật khẩu",
        });

      const hashedPassword = await argon2.hash(newPassword);

      const data = {
        password: hashedPassword,
      };

      user = await User.findByIdAndUpdate(req.userId, data, { new: true });
      res.json({
        success: true,
        message: "Thay đổi mật khẩu thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
    }
  }
);

module.exports = router;
