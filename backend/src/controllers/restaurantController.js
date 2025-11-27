const db = require("../models");
const { Restaurant, Dish } = db;
const { Op } = require("sequelize");
const distanceUtil = require("../utils/distance");

// --- HELPER: FORMAT DATA FOR FRONTEND ---
// This ensures every restaurant has 'tags', 'dist', and numeric 'price'
const formatForFrontend = (restaurant, distance = null) => {
    // Convert Sequelize instance to plain JSON object
    const r = restaurant.toJSON ? restaurant.toJSON() : restaurant;

    // 1. Generate Tags (Mock logic: You can replace this with real DB columns later)
    // The frontend NEEDS these tags to filter Morning/Lunch/Dinner
    let generatedTags = [];
    const type = r.cuisine_type ? r.cuisine_type.toLowerCase() : "";
    
    if (type.includes('coffee') || type.includes('bakery')) generatedTags.push('morning', 'snack');
    if (type.includes('fast') || type.includes('burger')) generatedTags.push('lunch', 'dinner', 'snack');
    if (type.includes('japanese') || type.includes('italian')) generatedTags.push('lunch', 'dinner');
    if (generatedTags.length === 0) generatedTags.push('lunch', 'dinner'); // Default

    return {
        ...r,
        // Ensure ID is standard
        id: r.id,
        // Frontend expects 'dist' (number), your DB might not have it unless calculated
        dist: distance ? parseFloat(distance.toFixed(1)) : (Math.random() * 5).toFixed(1), 
        // Frontend expects 'price' as a number for the slider
        price: r.average_price || 20, 
        // Frontend expects 'tags' array
        tags: generatedTags, 
        // Fallback image if none exists
        image: r.image || "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&q=80" 
    };
};

const restaurantController = {

  // ============================
  // GET ALL RESTAURANTS
  // ============================
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll();
      
      // TRANSFORM: Map the data to the format React expects
      const formatted = restaurants.map(r => formatForFrontend(r));
      
      // RETURN ARRAY: React expects [...] not { restaurants: [...] }
      res.json(formatted); 
    } catch (error) {
      console.error("restaurant.getAll:", error);
      res.status(500).json({ error: "Failed to load restaurants" });
    }
  },

  // ============================
  // GET NEARBY RESTAURANTS
  // ============================
  getNearbyRestaurants: async (req, res) => {
    try {
      const { lat, lng, radius = 5 } = req.query;

      if (!lat || !lng) {
        // If no location provided, just return all (Safety fallback)
        return restaurantController.getAllRestaurants(req, res);
      }

      const restaurants = await Restaurant.findAll();
      const centerLat = parseFloat(lat);
      const centerLng = parseFloat(lng);
      const radKm = parseFloat(radius);

      const nearby = restaurants
        .map(r => {
          // Calculate distance
          const dist = distanceUtil(centerLat, centerLng, r.latitude, r.longitude);
          // Format immediately using our helper
          return formatForFrontend(r, dist);
        })
        .filter(item => item.dist <= radKm)
        .sort((a, b) => a.dist - b.dist);

      // RETURN ARRAY
      res.json(nearby);

    } catch (error) {
      console.error("restaurant.getNearby:", error);
      res.status(500).json({ error: "Failed to load nearby restaurants" });
    }
  },

  // ============================
  // SEARCH RESTAURANTS
  // ============================
  searchRestaurants: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim() === "") {
        return res.status(400).json({ error: "Search query required" });
      }

      const restaurants = await Restaurant.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${q}%` } },
            { cuisine_type: { [Op.iLike]: `%${q}%` } },
            { address: { [Op.iLike]: `%${q}%` } }
          ]
        }
      });

      const formatted = restaurants.map(r => formatForFrontend(r));
      res.json(formatted);

    } catch (error) {
      console.error("restaurant.search:", error);
      res.status(500).json({ error: "Search failed" });
    }
  },

  // ============================
  // GET RESTAURANT BY ID
  // ============================
  getRestaurantById: async (req, res) => {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findByPk(id, {
        include: [{ model: Dish }]
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      // Return single object
      res.json(formatForFrontend(restaurant));

    } catch (error) {
      console.error("restaurant.getById:", error);
      res.status(500).json({ error: "Failed to load restaurant" });
    }
  }
};

module.exports = restaurantController;