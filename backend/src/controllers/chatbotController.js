// src/controllers/chatbotController.js
const db = require("../models");
const chatEngine = require("../chatbot/aiEngine"); // path relative to controllers
const ChatHistory = require("../models").ChatHistory;

module.exports = {
  askBot: async (req, res) => {
    try {
      const userId = req.user.id;
      const { message, lat, lng } = req.body;

      if (!message || !message.trim()) return res.status(400).json({ error: "message required" });

      // generate reply using modular engine
      const reply = await chatEngine.generateReply({ userId, message, lat, lng });

      // save history
      await db.ChatHistory.create({ user_id: userId, role: "user", message });
      await db.ChatHistory.create({ user_id: userId, role: "assistant", message: reply });

      return res.json({ reply });
    } catch (err) {
      console.error("chatbot.askBot:", err);
      return res.status(500).json({ error: "Chatbot error" });
    }
  },

  getHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const history = await db.ChatHistory.findAll({ where: { user_id: userId }, order: [["createdAt", "ASC"]] });
      res.json({ history });
    } catch (err) {
      console.error("chatbot.getHistory:", err);
      res.status(500).json({ error: "Failed to load history" });
    }
  },

  clearHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      await db.ChatHistory.destroy({ where: { user_id: userId } });
      res.json({ message: "Chat history cleared" });
    } catch (err) {
      console.error("chatbot.clearHistory:", err);
      res.status(500).json({ error: "Failed to clear history" });
    }
  }
};
