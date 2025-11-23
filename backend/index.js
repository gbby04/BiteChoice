require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const db = require("./src/models");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("Testing database connection...");

    await db.sequelize.authenticate();
    console.log("Database connected successfully!");

    console.log("Syncing models...");
    await db.sequelize.sync({ alter: true });
    console.log("Models synced!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
