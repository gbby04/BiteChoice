const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const auth = require("../middleware/authMiddleware");

router.post("/activate", auth, subscriptionController.activateSubscription);
router.get("/status", auth, subscriptionController.getSubscriptionStatus);

module.exports = router;
