const { UserPreferences, MealHistory, Dish, Restaurant } = require("../models");
const { Op } = require("sequelize");

const suggestionService = {

  generateSuggestions: async (userId, filters = {}) => {
    // 1. Load preferences
    const prefs = await UserPreferences.findOne({ where: { user_id: userId } });

    // 2. Load meal history (avoid repeating dishes)
    const history = await MealHistory.findAll({
      where: { user_id: userId },
      limit: 20
    });

    const eatenDishIds = history.map(h => h.dish_id);

    // 3. Build dynamic filters safely
    let whereClause = {};

    // Halal filter
    if (prefs && prefs.halal !== null && prefs.halal !== undefined) {
      whereClause.halal = prefs.halal;     // adjust based on your Dish model field
    }

    // Budget filters
    if (prefs && prefs.budget_max) {
      whereClause.price = { [Op.lte]: prefs.budget_max };
    }

    if (filters.budget_max) {
      whereClause.price = { [Op.lte]: filters.budget_max };
    }

    // 4. Fetch dishes with restaurant
    const dishes = await Dish.findAll({
      where: whereClause,
      include: [{ model: Restaurant }]
    });

    // 5. Filter out recently eaten dishes
    const filtered = dishes.filter(d => !eatenDishIds.includes(d.dish_id));

    // 6. Return results (max 10)
    return filtered.slice(0, 10);
  }

};

module.exports = suggestionService;
