const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MealPlanItem = sequelize.define("MealPlanItem", {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    meal_date: DataTypes.DATE,
    meal_type: DataTypes.STRING,
  });

  MealPlanItem.associate = (models) => {
    MealPlanItem.belongsTo(models.MealPlan, { foreignKey: "plan_id" });
    MealPlanItem.belongsTo(models.Dish, { foreignKey: "dish_id" });
  };

  return MealPlanItem;
};
