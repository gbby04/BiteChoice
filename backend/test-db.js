require('dotenv').config(); // Try to load .env
const { Sequelize } = require('sequelize');

console.log("1. Testing .env file...");
console.log("   User:", process.env.DB_USER);
console.log("   Database:", process.env.DB_NAME);
console.log("   Password:", process.env.DB_PASS ? "****" : "(Missing!)");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: '127.0.0.1', // We force IP address to fix Windows bug
        dialect: 'postgres',
        port: 5432
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ SUCCESS! Connection has been established successfully.');
    } catch (error) {
        console.error('❌ FAILURE: Unable to connect to the database:', error.message);
    }
}

testConnection();