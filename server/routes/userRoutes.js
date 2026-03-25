const { register, login, setAvatar, getAllUsers, getCurrentMe, logout } = require("../controllers/usersController");
const protectRoute = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/me", protectRoute, getCurrentMe);
router.post("/logout", protectRoute, logout);
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", protectRoute, setAvatar);
router.get("/allusers/:id", protectRoute, getAllUsers);

module.exports = router;