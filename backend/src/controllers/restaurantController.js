const db = require("../models");
const { Restaurant, Dish } = db;
const { Op } = require("sequelize");
const distanceUtil = require("../utils/distance");

const restaurantController = {

  // ============================
  // GET ALL RESTAURANTS
  // ============================
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll();
      res.json({ restaurants });
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
        return res.status(400).json({ error: "lat and lng are required" });
      }

      const restaurants = await Restaurant.findAll();

      const centerLat = parseFloat(lat);
      const centerLng = parseFloat(lng);
      const radKm = parseFloat(radius);

      const nearby = restaurants
        .map(r => {
          const dist = distanceUtil(centerLat, centerLng, r.latitude, r.longitude);
          return { restaurant: r, distance_km: dist };
        })
        .filter(x => x.distance_km <= radKm)
        .sort((a, b) => a.distance_km - b.distance_km);

      res.json({ nearby });

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
        return res.status(400).json({ error: "Search query (q) is required" });
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

      res.json({ results: restaurants });

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

      res.json({ restaurant });

    } catch (error) {
      console.error("restaurant.getById:", error);
      res.status(500).json({ error: "Failed to load restaurant" });
    }
  }

};

module.exports = restaurantController;
