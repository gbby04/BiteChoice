const express = require("express");
const router = express.Router();
const wheelController = require("../controllers/wheelController");
const auth = require("../middleware/authMiddleware");
const premium = require("../middleware/premiumMiddleware");

router.get("/", auth, premium, wheelController.spinMealWheel);

module.exports = router;
