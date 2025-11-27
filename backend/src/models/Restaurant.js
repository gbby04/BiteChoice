const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Restaurant = sequelize.define("Restaurant", {
    restaurant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    
    // Location Data
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    
    // --- NEW COLUMNS ADDED ---
    average_price: DataTypes.INTEGER, // Needed for the Price Slider (e.g. 25)
    image: DataTypes.STRING,          // Needed for the Food Card UI
    // -------------------------

    price_range: DataTypes.STRING,    // You can keep this for "$$" display if you want
    cuisine_type: DataTypes.STRING,
    is_halal: DataTypes.BOOLEAN,
  });

  Restaurant.associate = (models) => {
    Restaurant.hasMany(models.Dish, { foreignKey: "restaurant_id" });
    Restaurant.hasMany(models.Review, { foreignKey: "restaurant_id" });
  };

  return Restaurant;
};
