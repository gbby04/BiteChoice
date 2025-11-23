const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishController");

router.get("/:id", dishController.getDishById);
router.get("/restaurant/:restaurant_id", dishController.getRestaurantDishes);

module.exports = router;
