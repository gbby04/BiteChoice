const OpenAI = require("openai");
const db = require("../models");
const { ChatHistory, UserPreferences, MealHistory, Dish, Restaurant } = db;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CHAT_MEMORY_LIMIT = 12; // number of recent messages to include

// Build a food-aware system prompt using user's preferences if available
async function buildSystemPrompt(userId) {
  let prompt = "You are BiteChoice assistant — a friendly food/meal planning assistant for users in Malaysia. Be concise, polite and provide helpful meal suggestions, recipes, or nearby restaurant ideas when asked. ";

  try {
    const prefs = await UserPreferences.findOne({ where: { user_id: userId } });
    if (prefs) {
      const parts = [];
      if (prefs.halal) parts.push("user prefers halal food");
      if (prefs.preferred_cuisines) parts.push(`prefers cuisines: ${prefs.preferred_cuisines}`);
      if (prefs.budget_min || prefs.budget_max) {
        parts.push(`budget range: ${prefs.budget_min || "N/A"} - ${prefs.budget_max || "N/A"}`);
      }
      if (parts.length) prompt += " Note: " + parts.join("; ") + ".";
    }
  } catch (e) {
    // ignore preferences errors — system prompt can still be used
    console.error("chatbot.buildSystemPrompt: prefs error", e);
  }

  prompt += " If user asks for recommendations, prefer short actionable steps and offer 2-3 options. When giving restaurants, include approximate price and distance suggestion if asked.";
  return prompt;
}

// Read last N messages from ChatHistory (most recent first), return in correct order for model
async function fetchRecentConversation(userId, limit = CHAT_MEMORY_LIMIT) {
  const rows = await ChatHistory.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
    limit,
  });
  // convert to messages in chronological order
  return rows.reverse().map(r => ({ role: r.role, content: r.message }));
}

async function saveMessage(userId, role, message, meta = null) {
  return ChatHistory.create({
    user_id: userId,
    role,
    message,
    meta,
  });
}

async function askOpenAI(userId, inputMessage, model = "gpt-4.1") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const systemPrompt = await buildSystemPrompt(userId);
  const recent = await fetchRecentConversation(userId);

  // Compose messages: system -> recent conversation -> user input
  const messages = [
    { role: "system", content: systemPrompt },
    ...recent,
    { role: "user", content: inputMessage },
  ];

  // Call OpenAI chat completions
  const response = await client.chat.completions.create({
    model,
    messages,
    max_tokens: 600,
    temperature: 0.8,
  });

  const text = response.choices?.[0]?.message?.content ?? "";

  // Save user message and assistant reply to DB
  await saveMessage(userId, "user", inputMessage);
  await saveMessage(userId, "assistant", text);

  return text;
}

module.exports = {
  ask: async (userId, message, opts = {}) => {
    const model = opts.model || "gpt-4.1";
    // Basic sanitization
    if (!message || typeof message !== "string") {
      throw new Error("Invalid message");
    }
    return askOpenAI(userId, message, model);
  },

  // helper: get conversation history (for UI)
  getHistory: async (userId, limit = 50) => {
    const rows = await ChatHistory.findAll({
      where: { user_id: userId },
      order: [["createdAt", "ASC"]],
      limit,
    });
    return rows;
  },

  clearHistory: async (userId) => {
    return ChatHistory.destroy({ where: { user_id: userId } });
  }
};
