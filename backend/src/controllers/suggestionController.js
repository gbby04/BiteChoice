const suggestionService = require("../services/suggestionService");

const suggestionController = {
  getMealSuggestions: async (req, res) => {
    try {
      const userId = req.user.id;
      const filters = req.query || {};
      const suggestions = await suggestionService.generateSuggestions(userId, filters);
      res.json({ suggestions });
    } catch (error) {
      console.error("suggestion.get:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  },
};

module.exports = suggestionController;
