const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MealPlan = sequelize.define("MealPlan", {
    plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plan_name: DataTypes.STRING,
  });

  MealPlan.associate = (models) => {
    MealPlan.belongsTo(models.User, { foreignKey: "user_id" });
    MealPlan.hasMany(models.MealPlanItem, { foreignKey: "plan_id" });
  };

  return MealPlan;
};
