const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserPreferences = sequelize.define("UserPreferences", {
    preference_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    budget_min: DataTypes.INTEGER,
    budget_max: DataTypes.INTEGER,
    halal: DataTypes.BOOLEAN,
    max_distance_km: DataTypes.INTEGER,
    preferred_cuisines: DataTypes.TEXT,
  });

  UserPreferences.associate = (models) => {
    UserPreferences.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return UserPreferences;
};
