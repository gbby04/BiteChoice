const express = require("express");
const router = express.Router();
const suggestionController = require("../controllers/suggestionController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, suggestionController.getMealSuggestions);

module.exports = router;
