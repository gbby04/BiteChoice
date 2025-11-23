const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, historyController.getMealHistory);
router.post("/", auth, historyController.addMealHistory);

module.exports = router;
