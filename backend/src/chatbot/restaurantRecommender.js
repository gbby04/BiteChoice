// src/chatbot/restaurantRecommender.js
const db = require("../models");
const distanceUtil = require("../utils/distance");

async function findNearby(lat, lng, radiusKm = 5, opts = {}) {
  // fetch all restaurants (small dataset); for big data replace with geospatial SQL
  const restaurants = await db.Restaurant.findAll();

  const centerLat = parseFloat(lat);
  const centerLng = parseFloat(lng);
  const rad = Number(radiusKm) || 5;

  const filtered = restaurants
    .map(r => {
      const dist = distanceUtil(centerLat, centerLng, r.latitude, r.longitude);
      return { restaurant: r, distance_km: dist };
    })
    .filter(x => x.distance_km <= rad);

  // apply halal / cuisine / price filters if provided
  let results = filtered;
  if (opts.halal !== undefined) {
    results = results.filter(r => (r.restaurant.is_halal === !!opts.halal));
  }

  if (opts.max_price) {
    // if you maintain restaurant.price_range or dish prices, refine here
    results = results.filter(r => true); // placeholder if you implement price per restaurant
  }

  // sort by distance
  results.sort((a, b) => a.distance_km - b.distance_km);

  return results.map(x => ({
    id: x.restaurant.restaurant_id,
    name: x.restaurant.name,
    cuisine: x.restaurant.cuisine_type,
    is_halal: x.restaurant.is_halal,
    distance_km: Number(x.distance_km.toFixed(2)),
    address: x.restaurant.address
  }));
}

module.exports = { findNearby };
