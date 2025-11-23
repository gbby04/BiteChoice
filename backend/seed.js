// seed.js
require("dotenv").config();

const path = require("path");
const fs = require("fs");

console.log("🚀 Starting custom seeding...");

const models = require("./src/models"); // loads your sequelize instance + models
const sequelize = models.sequelize;

async function runSeeders() {
  try {
    // Path to your seeders folder
    const seedersPath = path.join(__dirname, "src", "seeders");

    // Get all JS files in seeders folder, sorted alphabetically
    const files = fs
      .readdirSync(seedersPath)
      .filter(file => file.endsWith(".js"))
      .sort();

    console.log("📌 Found seed files:", files);

    // Execute each seeder in order
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
