const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//鉴权中间件，检查是否登录
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "未登录，请先登录！" });
    }

    //验证token是否有效
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //把用户信息挂载到req，后续接口可以用
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "用户不存在，请重新登录！" });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "token无效，请重新登录！" })
  }
};

module.exports = protectRoute;