const db = require("../models");
const { MealHistory, Restaurant } = db;
const { Op } = require("sequelize");

// Helper function to calculate date ranges
const getRange = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0); // Start of day
    return date;
};

const historyController = {
    getMealHistory: async (req, res) => {
        try {
            // User ID is provided by authMiddleware
            const userId = req.user.userId; 
            
            // Define time boundaries for filtering
            const todayStart = getRange(0);
            const yesterdayStart = getRange(1);
            const twoDaysAgoStart = getRange(2);
            const weekAgoStart = getRange(7);

            const allHistory = await MealHistory.findAll({
                where: { user_id: userId },
                // Include the restaurant details for display
                include: [{ 
                    model: Restaurant,
                    attributes: ['name', 'image', 'cuisine_type']
                }],
                order: [['time_eaten', 'DESC']]
            });

            // Process and group the results into the frontend's required format
            const historyData = { today: [], yesterday: [], week: [], older: [] };
            
            allHistory.forEach(item => {
                const eatenTime = new Date(item.time_eaten);
                const itemData = {
                    id: item.id,
                    restaurant: item.Restaurant.name,
                    items: item.items_description || 'Various items', // Assuming you have this column
                    price: `RM ${item.total_price.toFixed(2)}`, // Assuming total_price exists
                    time: eatenTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    tag: item.Restaurant.cuisine_type,
                    image: item.Restaurant.image,
                };

                if (eatenTime >= todayStart) {
                    historyData.today.push(itemData);
                } else if (eatenTime >= yesterdayStart) {
                    historyData.yesterday.push(itemData);
                } else if (eatenTime >= weekAgoStart) {
                    historyData.week.push(itemData);
                } else {
                    historyData.older.push(itemData);
                }
            });

            res.json(historyData);
        } catch (error) {
            console.error("history.getMealHistory:", error);
            res.status(500).json({ error: "Failed to load eating history" });
        }
    }
};

module.exports = historyController;

