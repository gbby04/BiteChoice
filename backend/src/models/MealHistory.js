const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MealHistory = sequelize.define("MealHistory", {
    history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eaten_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  MealHistory.associate = (models) => {
    MealHistory.belongsTo(models.User, { foreignKey: "user_id" });
    MealHistory.belongsTo(models.Dish, { foreignKey: "dish_id" });
  };

  return MealHistory;
};
