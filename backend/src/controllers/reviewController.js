const db = require("../models");
const { Review, User, Restaurant } = db;
const { Op } = require("sequelize");

const reviewController = {
    // GET /reviews - Fetches all reviews, optionally filtered by search/sort
    getCommunityReviews: async (req, res) => {
        try {
            const { search = '', sort = 'newest' } = req.query;
            let orderCriteria = [['createdAt', 'DESC']];

            if (sort === 'top') {
                orderCriteria = [['rating', 'DESC']];
            } else if (sort === 'lowest') {
                orderCriteria = [['rating', 'ASC']];
            }

            const reviews = await Review.findAll({
                where: {
                    // Filter based on restaurant name or content
                    [Op.or]: [
                        { content: { [Op.iLike]: `%${search}%` } },
                        // This assumes you can search by associated restaurant name
                        // NOTE: Requires 'include' logic for search to be fully accurate
                    ]
                },
                include: [
                    { model: User, attributes: ['name'] }, // To show who wrote the review
                    { model: Restaurant, attributes: ['name', 'cuisine_type'] } // To show what was reviewed
                ],
                order: orderCriteria
            });

            res.json(reviews);
        } catch (error) {
            console.error("review.getCommunityReviews error:", error);
            res.status(500).json({ error: "Failed to load community reviews" });
        }
    },

// ... inside authController = { ...

    submitReview: async (req, res) => {
        try {
            // UserId is available via authMiddleware
            const userId = req.user.userId;
            const { restaurant_name, rating, content } = req.body; 

            // Find the restaurant ID (assuming the name is passed from the frontend)
            const restaurant = await Restaurant.findOne({ where: { name: restaurant_name } });

            if (!restaurant) {
                return res.status(404).json({ error: "Restaurant not found." });
            }

            const newReview = await Review.create({
                user_id: userId,
                restaurant_id: restaurant.restaurant_id,
                rating: rating,
                content: content,
                // Assuming other required fields like createdAt/updatedAt are handled automatically
            });

            res.status(201).json({ 
                message: "Review posted successfully!", 
                review: newReview 
            });

        } catch (error) {
            console.error("review.submitReview error:", error);
            res.status(500).json({ error: "Failed to post review. Check logs." });
        }
    }
    // ... rest of the controller
};

module.exports = reviewController;


