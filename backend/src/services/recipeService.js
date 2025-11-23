const { RecipeRequest } = require("../models");

const recipeService = {
  generate: async (userId, ingredients) => {
    // save request to DB
    await RecipeRequest.create({
      user_id: userId,
      ingredients
    });

    // Basic example response (replace with AI integration)
    const recipe = {
      title: "Custom Recipe Based on Ingredients",
      ingredients: ingredients.split(",").map(i => i.trim()),
      steps: [
        "Step 1: Prepare your ingredients.",
        "Step 2: Cook them in a pan.",
        "Step 3: Season and serve."
      ]
    };

    return recipe;
  }
};

module.exports = recipeService;
