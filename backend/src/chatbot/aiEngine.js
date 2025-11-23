// src/chatbot/aiEngine.js
const intentDetector = require("./intentDetector");
const foodEngine = require("./foodEngine");
const mealPlanGenerator = require("./mealPlanGenerator");
const restaurantRecommender = require("./restaurantRecommender");

async function generateReply({ userId, message, lat, lng }) {
  const intentRes = intentDetector.detectIntent(message);
  const intent = intentRes.intent;

  switch (intent) {
    case "greeting":
      return "Hey there! 😊 I’m BiteChoice—your friendly food helper. I can suggest meals, make simple recipes, or even find restaurants near you. What are you craving today?";

    case "recipe": {
      const suggestions = await foodEngine.suggestDishesForUser(userId, {});
      if (suggestions.length === 0)
        return "Hmm… I couldn’t find a dish to base a recipe on. Maybe tell me a food you like? I can help from there!";

      const top = suggestions[0];
      return `Sure! Here's a simple recipe for **${top.name}** 🍳:\n\n1) Prepare your ingredients.\n2) Saute onions and garlic.\n3) Add **${top.name}**.\n4) Season and cook until it's ready.\n\nEnjoy your meal! 😄`;
    }

    case "nearby_restaurant": {
      if (!lat || !lng)
        return "Oops! 😅 I need your **latitude and longitude** to look up nearby restaurants. Can you send them?";

      const nearby = await restaurantRecommender.findNearby(lat, lng, 10);
      if (!nearby || nearby.length === 0)
        return "I checked around, but I couldn't find any restaurants nearby. Maybe try expanding your area? 💡";

      const top = nearby
        .slice(0, 3)
        .map(r => `${r.name} (${r.cuisine}, ~${r.distance_km} km away)`)
        .join(", ");

      return `Here are some nearby places you might like 🍽️:\n${top}\n\nWant me to suggest a dish from one of these?`;
    }

    case "suggestion": {
      const results = await foodEngine.suggestDishesForUser(userId);
      if (results.length === 0)
        return "I tried my best, but I couldn't find a good suggestion 😔 Maybe try adjusting your budget or telling me what cuisine you prefer?";

      const lines = results
        .slice(0, 3)
        .map(d => `${d.name} — RM${d.price} at ${d.restaurant.name}`);

      return `Here are some options I think you'll enjoy 😋:\n- ${lines.join("\n- ")}`;
    }

    case "meal_plan": {
      const plan = await mealPlanGenerator.generateSimplePlan(userId, 3);

      let out = "Here's a simple and tasty 3-day meal plan just for you! 😄\n\n";
      plan.forEach(day => {
        out += `🍽️ **Day ${day.day}:**\n`;
        day.meals.forEach(m => {
          const dishName = m.dish ? m.dish.name : "No dish available";
          out += ` • ${m.meal_type}: ${dishName}\n`;
        });
        out += "\n";
      });

      return out.trim();
    }

    case "budget": {
      const opts = {};
      if (intentRes.budget_max) opts.max_price = Number(intentRes.budget_max);

      const results = await foodEngine.suggestDishesForUser(userId, opts);
      if (results.length === 0)
        return "Looks like nothing fits that budget 😔 Maybe try increasing it a little?";

      return `Here are some yummy options within your budget 💸:\n${results
        .slice(0, 5)
        .map(d => `${d.name} (RM${d.price})`)
        .join(", ")}`;
    }

    case "filter":
      if (intentRes.filter && intentRes.filter.halal) {
        const results = await foodEngine.suggestDishesForUser(userId, { halal: true });
        if (!results || results.length === 0)
          return "I couldn't find any halal options yet 😕 Maybe we need to add more data.";
        return `Here are some halal-friendly choices 🌙:\n${results
          .slice(0, 3)
          .map(d => `${d.name} at ${d.restaurant.name}`)
          .join("\n")}`;
      }
      return "Got it! I’ll remember your preference 😊";

    default: {
      const fallback = await foodEngine.suggestDishesForUser(userId, {});
      if (fallback.length > 0)
        return `How about **${fallback[0].name}**? It's RM${fallback[0].price} and quite popular 😄`;
      return "I'm not too sure yet 🤔 Try asking for **suggestions**, **recipes**, or **nearby restaurants**!";
    }
  }
}

module.exports = { generateReply };
