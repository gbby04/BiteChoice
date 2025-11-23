const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RecipeRequest = sequelize.define("RecipeRequest", {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ingredients: DataTypes.TEXT,
  });

  RecipeRequest.associate = (models) => {
    RecipeRequest.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return RecipeRequest;
};
