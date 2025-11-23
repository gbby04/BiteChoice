/** 
 * Feature Module: Subscription System
 * STATUS: FUTURE FEATURE (Not implemented in prototype)
 * 
 * This file is included for system planning and scalability.
 * Backend routes are inactive in the prototype.
 */

const recipeService = require("../services/recipeService");

const recipeController = {
  generateRecipe: async (req, res) => {
    try {
      const userId = req.user.id;
      const { ingredients } = req.body;
      if (!ingredients) return res.status(400).json({ error: "ingredients required" });

      const recipe = await recipeService.generate(userId, ingredients);
      res.json({ recipe });
    } catch (error) {
      console.error("recipe.generate:", error);
      res.status(500).json({ error: "Failed to generate recipe" });
    }
  },
};

module.exports = recipeController;
