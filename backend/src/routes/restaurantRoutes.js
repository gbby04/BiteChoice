const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/", restaurantController.getAllRestaurants);
router.get("/nearby", restaurantController.getNearbyRestaurants);
router.get("/search", restaurantController.searchRestaurants);
router.get("/:id", restaurantController.getRestaurantById);

module.exports = router;
