const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");
const auth = require("../middleware/authMiddleware");

// offline chatbot
router.post("/message", auth, chatbotController.askBot);

router.get("/history", auth, chatbotController.getHistory);
router.delete("/history", auth, chatbotController.clearHistory);

module.exports = router;
