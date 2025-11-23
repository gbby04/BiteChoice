const db = require("../models");
const { MealHistory, Dish } = db;

const historyController = {
  getMealHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const history = await MealHistory.findAll({
        where: { user_id: userId },
        include: [{ model: Dish }],
        order: [["eaten_at", "DESC"]],
      });
      res.json({ history });
    } catch (error) {
      console.error("history.get:", error);
      res.status(500).json({ error: "Failed to load history" });
    }
  },

  addMealHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { dish_id } = req.body;
      if (!dish_id) return res.status(400).json({ error: "dish_id is required" });

      const item = await MealHistory.create({ user_id: userId, dish_id });
      res.status(201).json({ message: "Meal added to history", item });
    } catch (error) {
      console.error("history.add:", error);
      res.status(500).json({ error: "Failed to add meal history" });
    }
  },
};

module.exports = historyController;
