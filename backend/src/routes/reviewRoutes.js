const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, reviewController.addReview);
router.get("/restaurant/:id", reviewController.getRestaurantReviews);
router.get("/dish/:id", reviewController.getDishReviews);

module.exports = router;
