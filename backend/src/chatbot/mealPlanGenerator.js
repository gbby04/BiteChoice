// src/chatbot/mealPlanGenerator.js
const db = require("../models");

async function generateSimplePlan(userId, days = 3) {
  // Pull some dishes (respecting halal pref)
  const prefs = await db.UserPreferences.findOne({ where: { user_id: userId } });
  const where = {};
  if (prefs && prefs.halal) where.halal = true;

  const dishes = await db.Dish.findAll({ where, include: [{ model: db.Restaurant }], limit: days * 3 });

  // group into days, breakfast/lunch/dinner
  const mealTypes = ["breakfast", "lunch", "dinner"];
  const plan = [];

  for (let d = 0; d < days; d++) {
    const day = { day: d + 1, meals: [] };
    for (let m = 0; m < 3; m++) {
      const dish = dishes[d * 3 + m] || dishes[(d + m) % dishes.length] || null;
      day.meals.push({
        meal_type: mealTypes[m],
        dish: dish ? {
          dish_id: dish.dish_id,
          name: dish.name,
          price: dish.price,
          restaurant: dish.Restaurant ? { id: dish.Restaurant.restaurant_id, name: dish.Restaurant.name } : null
        } : null
      });
    }
    plan.push(day);
  }

  return plan;
}

module.exports = { generateSimplePlan };
