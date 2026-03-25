const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require("../utils/generateToken");

//获取当前登录用户信息
module.exports.getCurrentMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

// 退出登录：清除 JWT cookie
module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ status: true, msg: "已退出登录" });
  } catch (error) {
    next(error);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) return res.json({ msg: "用户名已存在", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck) return res.json({ msg: "邮箱已存在", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    generateToken(user._id, res);

    const safeUser = user.toObject();
    delete safeUser.password;
    return res.json({ status: true, user: safeUser });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.json({ msg: "用户名或密码错误", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.json({ msg: "用户名或密码错误", status: false });

    generateToken(user._id, res);

    const safeUser = user.toObject();
    delete safeUser.password;
    return res.json({ status: true, user: safeUser });
  } catch (error) {
    next(error);
  }
}

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      { isAvatarImageSet: true, avatarImage },
      { new: true }
    );
    if (!userData) {
      return res.json({ isSet: false, image: "" });
    }
    return res.json({
      isSet: true,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json({ users });
  } catch (error) {
    next(error);
  }
}