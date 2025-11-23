// src/chatbot/intentDetector.js
module.exports = {
  detectIntent: (text) => {
    const msg = (text || "").toLowerCase();

    // greetings
    if (/\b(hi|hello|hey|hai|apa khabar|salam)\b/.test(msg)) return { intent: "greeting" };

    // recipe requests
    if (/\b(recipe|how to cook|resepi|resepi|cara masak)\b/.test(msg)) return { intent: "recipe" };

    // meal plan
    if (/\b(plan|meal plan|weekly plan|3-day|7-day|week plan)\b/.test(msg)) return { intent: "meal_plan" };

    // restaurant nearby
    if (/\b(nearby|near me|nearby restaurant|sibu|near)\b/.test(msg)) return { intent: "nearby_restaurant" };

    // ask for suggestions
    if (/\b(suggest|what should i eat|i want|i feel like|recommend)\b/.test(msg)) return { intent: "suggestion" };

    // budget
    const budgetMatch = msg.match(/(?:rm|rm\s?)?\s?(\d{1,3})(?:\s?-\s?(?:rm\s?)?(\d{1,3}))?/);
    if (budgetMatch) return { intent: "budget", budget_min: budgetMatch[1], budget_max: budgetMatch[2] || null };

    // halal request
    if (/\b(halal)\b/.test(msg)) return { intent: "filter", filter: { halal: true } };

    // health / healthy
    if (/\b(healthy|health|diet|low calorie|kurus)\b/.test(msg)) return { intent: "health" };

    // fallback
    return { intent: "unknown" };
  }
};
