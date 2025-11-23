/** 
 * Feature Module: Subscription System
 * STATUS: FUTURE FEATURE (Not implemented in prototype)
 * 
 * This file is included for system planning and scalability.
 * Backend routes are inactive in the prototype.
 */

const wheelService = require("../services/wheelService");

const wheelController = {
  spinMealWheel: async (req, res) => {
    try {
      const meal = await wheelService.spin();
      if (!meal) return res.status(404).json({ error: "No meals available" });
      res.json({ result: meal });
    } catch (error) {
      console.error("wheel.spin:", error);
      res.status(500).json({ error: "Failed to spin wheel" });
    }
  },
};

module.exports = wheelController;
