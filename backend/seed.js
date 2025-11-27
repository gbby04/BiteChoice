// seed.js
require("dotenv").config();
const path = require("path");
const fs = require("fs");

console.log("🚀 Starting custom seeding...");

const models = require("./src/models");
const sequelize = models.sequelize;

async function runSeeders() {
  try {
    // ---------------------------------------------------------
    // NEW LINE: Create the tables first!
    // { force: true } DELETES existing data to start fresh
    // ---------------------------------------------------------
    await sequelize.sync({ force: true });
    console.log("✅ Tables created successfully.");

    // Path to your seeders folder
    const seedersPath = path.join(__dirname, "src", "seeders");

    // Check if folder exists
    if (!fs.existsSync(seedersPath)) {
        console.error("❌ Folder src/seeders not found! Please create it.");
        return;
    }

    const files = fs
      .readdirSync(seedersPath)
      .filter(file => file.endsWith(".js"))
      .sort();

    console.log("📌 Found seed files:", files);

    for (const file of files) {
      console.log(`➡ Running seeder: ${file}`);
      const seeder = require(path.join(seedersPath, file));

      if (seeder.up) {
        await seeder.up(models.sequelize.getQueryInterface(), models.Sequelize);
      }
    }

    console.log("✨ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeder error:", err);
  } finally {
    await sequelize.close();
    console.log("🔌 DB Connection closed.");
  }
}

runSeeders();
