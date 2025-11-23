// src/controllers/mealPlanController.js
const db = require("../models");
const { Op } = db.Sequelize;
const { MealPlan, MealPlanItem, Dish, Restaurant } = db;

const mealPlanController = {
  // ========================
  // CREATE A NEW MEAL PLAN
  // ========================
  createMealPlan: async (req, res) => {
    try {
      const userId = req.user.id;
      const { plan_name } = req.body;

      if (!plan_name) {
        return res.status(400).json({ error: "plan_name is required" });
      }

      const plan = await MealPlan.create({
        user_id: userId,
        plan_name,
      });

      res.status(201).json({
        message: "Meal plan created",
        plan,
      });
    } catch (error) {
      console.error("mealPlan.create:", error);
      res.status(500).json({ error: "Failed to create meal plan" });
    }
  },

  // ==========================
  // GET ALL USER'S MEAL PLANS
  // ==========================
  getUserMealPlans: async (req, res) => {
    try {
      const userId = req.user.id;

      const plans = await MealPlan.findAll({
        where: { user_id: userId },
        include: [
          {
            model: MealPlanItem,
            include: [{ model: Dish }],
            order: [["meal_date", "ASC"]],
          },
        ],
      });

      res.json({ plans });
    } catch (error) {
      console.error("mealPlan.getUser:", error);
      res.status(500).json({ error: "Failed to load plans" });
    }
  },

  // ======================
  // GET SPECIFIC MEAL PLAN
  // ======================
  getMealPlan: async (req, res) => {
    try {
      const { id } = req.params;

      const plan = await MealPlan.findByPk(id, {
        include: [
          {
            model: MealPlanItem,
            include: [{ model: Dish }],
            order: [["meal_date", "ASC"]],
          },
        ],
      });

      if (!plan) {
        return res.status(404).json({ error: "Meal plan not found" });
      }

      // Optional: ensure the user owns this plan
      if (plan.user_id !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized: You do not own this meal plan" });
      }

      res.json({ plan });
    } catch (error) {
      console.error("mealPlan.get:", error);
      res.status(500).json({ error: "Failed to load plan" });
    }
  },

  // ==========================
  // ADD ITEM TO MEAL PLAN
  // ==========================
  addMealPlanItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params; // meal plan ID
      const { meal_date, meal_type, dish_id } = req.body;

      // ---- 1. VALIDATION ----
      if (!meal_date || !meal_type || !dish_id) {
        return res.status(400).json({
          error: "meal_date, meal_type, and dish_id are required",
        });
      }

      const validTypes = ["breakfast", "lunch", "dinner"];
      if (!validTypes.includes(meal_type.toLowerCase())) {
        return res.status(400).json({
          error: "meal_type must be breakfast, lunch, or dinner",
        });
      }

      // ---- 2. CHECK OWNERSHIP ----
      const plan = await MealPlan.findOne({
        where: { plan_id: id, user_id: userId },
      });

      if (!plan) {
        return res.status(403).json({
          error: "Unauthorized: You do not own this meal plan",
        });
      }

      // ---- 3. DISH EXISTS CHECK ----
      const dish = await Dish.findByPk(dish_id);
      if (!dish) {
        return res.status(404).json({ error: "Dish not found" });
      }

      // ---- 4. CREATE ITEM ----
      const item = await MealPlanItem.create({
        plan_id: id,
        meal_date,
        meal_type,
        dish_id,
      });

      // ---- 5. REFRESH (include full details) ----
      const fullItem = await MealPlanItem.findByPk(item.item_id, {
        include: [
          { model: Dish },
          { model: MealPlan },
        ],
      });

      return res.status(201).json({
        message: "Meal added to plan",
        item: fullItem,
      });
    } catch (error) {
      console.error("mealPlan.addItem:", error);
      return res.status(500).json({
        error: "Failed to add meal to plan",
      });
    }
  },

  // ============================
  // AUTO-GENERATE MEAL PLAN (UPGRADED)
  // Supports query params:
  //  - days (number, default 3, max 14)
  //  - halal=true|false
  //  - budget=low|medium|high
  //  - diet=protein|vegetarian
  //  - avoid=comma,separated,keywords
  // Example:
  // GET /meal-plans/generate?days=7&halal=true&budget=low&diet=protein&avoid=spicy,seafood
  // ============================
  generateMealPlan: async (req, res) => {
    try {
      const userId = req.user.id;

      // Parse query params
      const days = Math.min(Math.max(parseInt(req.query.days || "3", 10), 1), 14); // 1..14
      const halalParam = req.query.halal;
      const halal = halalParam === "true" || halalParam === "1" ? true : halalParam === "false" || halalParam === "0" ? false : undefined;
      const budget = (req.query.budget || "").toLowerCase(); // low, medium, high
      const diet = (req.query.diet || "").toLowerCase(); // protein, vegetarian
      const avoidRaw = req.query.avoid || "";
      const avoidKeywords = avoidRaw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

      // Build where clause
      const where = {};

      if (halal !== undefined) where.halal = halal;

      // Budget -> map to price ranges (MYR)
      if (budget === "low") {
        where.price = { [Op.lte]: 10 };
      } else if (budget === "medium") {
        where.price = { [Op.between]: [11, 20] };
      } else if (budget === "high") {
        where.price = { [Op.gte]: 20 };
      }

      // Diet filter - use text matching on name/description
      const dietKeywords = {
        protein: ["chicken", "beef", "pork", "fish", "salmon", "tuna", "egg", "shrimp", "prawn", "steak"],
        vegetarian: ["tofu", "vegetarian", "veg", "vegetable", "salad", "mushroom", "tempeh"]
      };

      // Build base query including Restaurant for context
      const allDishes = await Dish.findAll({
        where,
        include: [{ model: Restaurant }],
      });

      // Filter in JS for diet & avoid & ensure we have usable objects
      let candidates = allDishes.filter(d => d && d.name);

      // Diet filtering
      if (diet && dietKeywords[diet]) {
        const kws = dietKeywords[diet];
        candidates = candidates.filter(d => {
          const text = `${d.name} ${d.description || ""}`.toLowerCase();
          return kws.some(k => text.includes(k));
        });
      }

      // Avoid filtering
      if (avoidKeywords.length > 0) {
        candidates = candidates.filter(d => {
          const text = `${d.name} ${d.description || ""}`.toLowerCase();
          return !avoidKeywords.some(k => text.includes(k));
        });
      }

      // If halal required but model uses different naming, we already filtered by where.halal if set.
      // If candidates empty and there were diet or budget filters, try relaxing diet first then budget.
      if (candidates.length === 0) {
        // Relax diet constraint if present: try ignoring diet
        if (diet) {
          const fallback = allDishes.filter(d => {
            const text = `${d.name} ${d.description || ""}`.toLowerCase();
            return !avoidKeywords.some(k => text.includes(k));
          });
          if (fallback.length > 0) candidates = fallback;
        }
      }

      // Final fallback: use all dishes (respecting halal if requested)
      if (candidates.length === 0) {
        const fallbackAll = await Dish.findAll({
          include: [{ model: Restaurant }]
        });
        candidates = fallbackAll.filter(d => {
          if (halal === true && !d.halal) return false;
          const text = `${d.name} ${d.description || ""}`.toLowerCase();
          return !avoidKeywords.some(k => text.includes(k));
        });
      }

      if (candidates.length === 0) {
        return res.status(404).json({ error: "No dishes found matching your filters" });
      }

      // Shuffle candidates for variety
      function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      candidates = shuffle(candidates);

      // Build plan: each day breakfast/lunch/dinner, try to avoid repeats until candidates exhausted
      const mealTypes = ["breakfast", "lunch", "dinner"];
      const usedIds = new Set();
      const plan = [];

      for (let d = 0; d < days; d++) {
        const dayObj = { day: d + 1, meals: [] };
        for (let m = 0; m < mealTypes.length; m++) {
          // Find next dish not used yet; if none, allow reuse
          let dish = candidates.find(x => !usedIds.has(x.dish_id));
          if (!dish) {
            dish = candidates[Math.floor(Math.random() * candidates.length)];
          }
          if (dish) {
            usedIds.add(dish.dish_id);
            dayObj.meals.push({
              meal_type: mealTypes[m],
              dish: {
                dish_id: dish.dish_id,
                name: dish.name,
                price: dish.price,
                halal: dish.halal,
                description: dish.description,
                restaurant: dish.Restaurant ? {
                  restaurant_id: dish.Restaurant.restaurant_id,
                  name: dish.Restaurant.name,
                  cuisine_type: dish.Restaurant.cuisine_type
                } : null
              }
            });
          } else {
            dayObj.meals.push({
              meal_type: mealTypes[m],
              dish: null
            });
          }
        }
        plan.push(dayObj);
      }

      return res.json({
        message: "Generated meal plan",
        user_id: userId,
        filters: { days, halal, budget, diet, avoid: avoidKeywords },
        plan,
      });
    } catch (error) {
      console.error("mealPlan.generate:", error);
      return res.status(500).json({ error: "Failed to generate meal plan" });
    }
  },
};

module.exports = mealPlanController;
