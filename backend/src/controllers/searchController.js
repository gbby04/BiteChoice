// src/controllers/searchController.js
const db = require("../models");
const { Op } = db.Sequelize;
const { Dish, Restaurant } = db;

const normalizeQuery = (q) => (q || "").trim();

module.exports = {
  /**
   * GET /search?query=chicken&type=all|dish|restaurant&page=1&limit=10&halal=true
   */
  search: async (req, res) => {
    try {
      const rawQuery = normalizeQuery(req.query.query);
      const type = (req.query.type || "all").toLowerCase(); // all / dish / restaurant
      const page = Math.max(parseInt(req.query.page || "1", 10), 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
      const offset = (page - 1) * limit;
      const halalParam = req.query.halal;
      const halal = halalParam === "true" ? true : halalParam === "false" ? false : undefined;

      if (!rawQuery) {
        return res.status(400).json({ error: "query parameter is required" });
      }

      // Build ilike pattern for Postgres
      const pattern = `%${rawQuery.replace(/\s+/g, "%")}%`;

      const results = { query: rawQuery, type, page, limit, total: 0, items: [] };

      // Search dishes
      if (type === "all" || type === "dish") {
        const dishWhere = {
          [Op.or]: [
            { name: { [Op.iLike]: pattern } },
            { description: { [Op.iLike]: pattern } }
          ]
        };
        if (halal !== undefined) dishWhere.halal = halal;

        const { rows: dishes, count: dishCount } = await Dish.findAndCountAll({
          where: dishWhere,
          include: [{ model: db.Restaurant, attributes: ['restaurant_id','name','cuisine_type','is_halal'] }],
          offset,
          limit,
          order: [["name", "ASC"]]
        });

        results.total += dishCount;
        results.items.push(...dishes.map(d => ({
          kind: "dish",
          dish_id: d.dish_id,
          name: d.name,
          description: d.description,
          price: d.price,
          halal: d.halal,
          restaurant: d.Restaurant ? {
            restaurant_id: d.Restaurant.restaurant_id,
            name: d.Restaurant.name,
            cuisine_type: d.Restaurant.cuisine_type,
            is_halal: d.Restaurant.is_halal
          } : null
        })));
      }

      // Search restaurants
      if (type === "all" || type === "restaurant") {
        const restWhere = {
          [Op.or]: [
            { name: { [Op.iLike]: pattern } },
            { address: { [Op.iLike]: pattern } },
            { cuisine_type: { [Op.iLike]: pattern } }
          ]
        };
        if (halal !== undefined) restWhere.is_halal = halal;

        const { rows: restaurants, count: restCount } = await Restaurant.findAndCountAll({
          where: restWhere,
          offset,
          limit,
          order: [["name", "ASC"]]
        });

        results.total += restCount;
        results.items.push(...restaurants.map(r => ({
          kind: "restaurant",
          restaurant_id: r.restaurant_id,
          name: r.name,
          address: r.address,
          cuisine_type: r.cuisine_type,
          is_halal: r.is_halal,
          latitude: r.latitude,
          longitude: r.longitude
        })));
      }

      // For combined results: sort by kind then name (you can tune)
      if (type === "all") {
        results.items.sort((a,b) => {
          if (a.kind === b.kind) return a.name.localeCompare(b.name);
          return a.kind.localeCompare(b.kind);
        });
      }

      res.json(results);
    } catch (err) {
      console.error("search.error:", err);
      res.status(500).json({ error: "Search failed" });
    }
  }
};
