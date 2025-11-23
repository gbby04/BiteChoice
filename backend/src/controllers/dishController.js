/** 
 * Feature Module: Subscription System
 * STATUS: FUTURE FEATURE (Not implemented in prototype)
 * 
 * This file is included for system planning and scalability.
 * Backend routes are inactive in the prototype.
 */

const db = require("../models");
const { Dish, Restaurant } = db;

const dishController = {
  getDishById: async (req, res) => {
    try {
      const { id } = req.params;
      const dish = await Dish.findByPk(id, { include: [{ model: Restaurant }] });
      if (!dish) return res.status(404).json({ error: "Dish not found" });
      res.json({ dish });
    } catch (error) {
      console.error("dish.getById:", error);
      res.status(500).json({ error: "Failed to load dish" });
    }
  },

  getRestaurantDishes: async (req, res) => {
    try {
      const { restaurant_id } = req.params;
      const dishes = await Dish.findAll({ where: { restaurant_id } });
      res.json({ dishes });
    } catch (error) {
      console.error("dish.getRestaurantDishes:", error);
      res.status(500).json({ error: "Failed to load restaurant dishes" });
    }
  },
};

module.exports = dishController;
