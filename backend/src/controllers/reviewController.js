/** 
 * Feature Module: Subscription System
 * STATUS: FUTURE FEATURE (Not implemented in prototype)
 * 
 * This file is included for system planning and scalability.
 * Backend routes are inactive in the prototype.
 */

const db = require("../models");
const { Review } = db;

const reviewController = {
  addReview: async (req, res) => {
    try {
      const userId = req.user.id;
      const { restaurant_id, dish_id, rating, review_text } = req.body;
      if (!restaurant_id && !dish_id) {
        return res.status(400).json({ error: "restaurant_id or dish_id is required" });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "rating must be 1-5" });
      }

      const review = await Review.create({
        user_id: userId,
        restaurant_id: restaurant_id || null,
        dish_id: dish_id || null,
        rating,
        review_text,
      });

      res.status(201).json({ message: "Review added", review });
    } catch (error) {
      console.error("review.add:", error);
      res.status(500).json({ error: "Failed to add review" });
    }
  },

  getRestaurantReviews: async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await Review.findAll({ where: { restaurant_id: id }, order: [["createdAt", "DESC"]] });
      res.json({ reviews });
    } catch (error) {
      console.error("review.getRestaurant:", error);
      res.status(500).json({ error: "Failed to load restaurant reviews" });
    }
  },

  getDishReviews: async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await Review.findAll({ where: { dish_id: id }, order: [["createdAt", "DESC"]] });
      res.json({ reviews });
    } catch (error) {
      console.error("review.getDish:", error);
      res.status(500).json({ error: "Failed to load dish reviews" });
    }
  },
};

module.exports = reviewController;
