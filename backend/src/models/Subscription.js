const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Subscription = sequelize.define("Subscription", {
    subscription_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plan_type: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
  });

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Subscription;
};
