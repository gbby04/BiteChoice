/** 
 * Feature Module: Subscription System
 * STATUS: FUTURE FEATURE (Not implemented in prototype)
 * 
 * This file is included for system planning and scalability.
 * Backend routes are inactive in the prototype.
 */

const db = require("../models");
const { UserPreferences } = db;

const preferenceController = {
  getPreferences: async (req, res) => {
    try {
      const userId = req.user.id;
      const prefs = await UserPreferences.findOne({ where: { user_id: userId } });
      res.json({ preferences: prefs || {} });
    } catch (error) {
      console.error("preference.get:", error);
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  },

  updatePreferences: async (req, res) => {
    try {
      const userId = req.user.id;
      const payload = req.body;

      const [prefs, created] = await UserPreferences.findOrCreate({
        where: { user_id: userId },
        defaults: { ...payload, user_id: userId },
      });

      if (!created) {
        await prefs.update(payload);
      }

      res.json({ message: "Preferences updated", preferences: prefs });
    } catch (error) {
      console.error("preference.update:", error);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  },
};

module.exports = preferenceController;
