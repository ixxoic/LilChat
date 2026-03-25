const { addMessage, getAllMessages } = require("../controllers/messagesController");
const protectRoute = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/addmsg", protectRoute, addMessage);
router.post("/getmsg", protectRoute, getAllMessages);

module.exports = router;