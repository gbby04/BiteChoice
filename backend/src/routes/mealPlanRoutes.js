const express = require("express");
const router = express.Router();
const mealPlanController = require("../controllers/mealPlanController");
const auth = require("../middleware/authMiddleware");
const premium = require("../middleware/premiumMiddleware");

router.get("/generate", auth, mealPlanController.generateMealPlan);

router.post("/", auth, premium, mealPlanController.createMealPlan);
router.get("/", auth, premium, mealPlanController.getUserMealPlans);
router.get("/:id", auth, premium, mealPlanController.getMealPlan);
router.post("/:id/items", auth, premium, mealPlanController.addMealPlanItem);

module.exports = router;
