const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Review = sequelize.define("Review", {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: DataTypes.INTEGER,
    review_text: DataTypes.TEXT,
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: "user_id" });
    Review.belongsTo(models.Restaurant, { foreignKey: "restaurant_id" });
    Review.belongsTo(models.Dish, { foreignKey: "dish_id" });
  };

  return Review;
};
