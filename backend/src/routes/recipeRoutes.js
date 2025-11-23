const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const auth = require("../middleware/authMiddleware");
const premium = require("../middleware/premiumMiddleware");

router.post("/generate", auth, premium, recipeController.generateRecipe);

module.exports = router;
