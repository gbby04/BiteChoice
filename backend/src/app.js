require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/authRoutes"));
app.use("/preferences", require("./routes/preferenceRoutes"));
app.use("/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/restaurants", require("./routes/restaurantRoutes"));
app.use("/dishes", require("./routes/dishRoutes"));
app.use("/suggestions", require("./routes/suggestionRoutes"));
app.use("/meal-wheel", require("./routes/wheelRoutes"));
app.use("/meal-history", require("./routes/historyRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/meal-plans", require("./routes/mealPlanRoutes"));
app.use("/recipes", require("./routes/recipeRoutes"));
app.use("/chatbot", require("./routes/chatbotRoutes"));
app.use("/search", require("./routes/searchRoutes"));
app.use("/user", require("./routes/userRoutes"));

// health check
app.get("/", (req, res) => {
  res.json({ message: "BiteChoice API running" });
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});