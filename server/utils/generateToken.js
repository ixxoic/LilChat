const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    httpOnly: true,      //前端JS无法读取，防XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",     //防止CSRF攻击
    maxAge: 7 * 24 * 60 * 60 * 1000, //7天
  });
};

module.exports = generateToken;