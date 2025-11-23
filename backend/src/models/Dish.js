module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define("Dish", {
    dish_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    halal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  Dish.associate = (models) => {
    Dish.belongsTo(models.Restaurant, {
      foreignKey: "restaurant_id",
      onDelete: "CASCADE"
    });

    Dish.hasMany(models.MealHistory, { foreignKey: "dish_id" });
    Dish.hasMany(models.Review, { foreignKey: "dish_id" });
    Dish.hasMany(models.MealPlanItem, { foreignKey: "dish_id" });
  };

  return Dish;
};
