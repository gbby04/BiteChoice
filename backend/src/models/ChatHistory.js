module.exports = (sequelize, DataTypes) => {
  const ChatHistory = sequelize.define("ChatHistory", {
    chat_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },  // user / assistant
    message: { type: DataTypes.TEXT, allowNull: false },
  });

  ChatHistory.associate = (models) => {
    ChatHistory.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return ChatHistory;
};
