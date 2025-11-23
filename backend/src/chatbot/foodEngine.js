// src/chatbot/foodEngine.js
const db = require("../models");
const { Op } = require("sequelize");

async function suggestDishesForUser(userId, opts = {}) {
  // Load preferences
  const prefs = await db.UserPreferences.findOne({ where: { user_id: userId } });

  // Load recent meal ids to avoid repetition
  const recent = await db.MealHistory.findAll({
    where: { user_id: userId },
    limit: 20,
    order: [["createdAt", "DESC"]]
  });
  const recentDishIds = recent.map(r => r.dish_id);

  // Build where clause
  const where = {};
  if (prefs && prefs.halal) where.halal = true;
  if (opts.halal) where.halal = true;

  if (opts.max_price) {
    where.price = { [Op.lte]: opts.max_price };
  } else if (prefs && prefs.budget_max) {
    where.price = { [Op.lte]: prefs.budget_max };
  }

  // optional cuisine filter
  if (opts.cuisine) where.cuisine = opts.cuisine;

  const dishes = await db.Dish.findAll({
    where,
    include: [{ model: db.Restaurant }]
  });

  // filter out recent dishes and return up to 10
  const filtered = dishes.filter(d => !recentDishIds.includes(d.dish_id)).slice(0, 10);

  return filtered.map(d => ({
    dish_id: d.dish_id,
    name: d.name,
    price: d.price,
    halal: d.halal,
    restaurant: {
      id: d.Restaurant?.restaurant_id,
      name: d.Restaurant?.name,
      cuisine: d.Restaurant?.cuisine_type
    }
  }));
}

module.exports = { suggestDishesForUser };
