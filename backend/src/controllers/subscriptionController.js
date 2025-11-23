/** 
 * Feature Module: Subscription System
 * STATUS: FUTURE FEATURE (Not implemented in prototype)
 * 
 * This file is included for system planning and scalability.
 * Backend routes are inactive in the prototype.
 */

const { Op } = require("sequelize");
const db = require("../models");
const { Subscription } = db;

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const subscriptionController = {
  activateSubscription: async (req, res) => {
    try {
      const userId = req.user.id;
      const { plan_type } = req.body; // 'monthly' or 'yearly'

      if (!["monthly", "yearly"].includes(plan_type)) {
        return res.status(400).json({ error: "Invalid plan_type" });
      }

      const start_date = new Date();
      const end_date = plan_type === "monthly" ? addMonths(start_date, 1) : addMonths(start_date, 12);

      const subscription = await Subscription.create({
        user_id: userId,
        plan_type,
        start_date,
        end_date,
        is_active: true,
      });

      res.status(201).json({ message: "Subscription activated", subscription });
    } catch (error) {
      console.error("subscription.activate:", error);
      res.status(500).json({ error: "Failed to activate subscription" });
    }
  },

  getSubscriptionStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const now = new Date();

      const active = await Subscription.findOne({
        where: {
          user_id: userId,
          is_active: true,
          end_date: { [Op.gte]: now },
        },
        order: [["end_date", "DESC"]],
      });

      res.json({ premium: !!active, subscription: active || null });
    } catch (error) {
      console.error("subscription.status:", error);
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  },
};

module.exports = subscriptionController;
