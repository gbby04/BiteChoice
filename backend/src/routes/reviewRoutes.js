const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /reviews is public, POST /reviews requires auth
router.get("/", reviewController.getCommunityReviews);
router.post("/", authMiddleware, reviewController.submitReview); 

module.exports = router;
