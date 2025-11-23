const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasOne(models.UserPreferences, { foreignKey: "user_id" });
    User.hasMany(models.Subscription, { foreignKey: "user_id" });
    User.hasMany(models.MealHistory, { foreignKey: "user_id" });
    User.hasMany(models.Review, { foreignKey: "user_id" });
    User.hasMany(models.MealPlan, { foreignKey: "user_id" });
    User.hasMany(models.RecipeRequest, { foreignKey: "user_id" });
  };

  return User;
};
