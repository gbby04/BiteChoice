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
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    price_range: DataTypes.STRING,
    cuisine_type: DataTypes.STRING,
    is_halal: DataTypes.BOOLEAN,
  });

  Restaurant.associate = (models) => {
    Restaurant.hasMany(models.Dish, { foreignKey: "restaurant_id" });
    Restaurant.hasMany(models.Review, { foreignKey: "restaurant_id" });
  };

  return Restaurant;
};
