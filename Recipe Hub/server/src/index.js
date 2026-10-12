require("dotenv").config();
const express = require("express");
const cors = require("cors");
const recipesRouter = require("./routes/recipes");
const reviewsRouter = require("./routes/reviews");
const authRouter = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");
const historyRouter = require("./routes/history");
const mealPlanRouter = require("./routes/mealPlan");
const shoppingListRouter = require("./routes/shoppingList");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/recipes/:recipeId/reviews", reviewsRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/history", historyRouter);
app.use("/api/meal-plan", mealPlanRouter);
app.use("/api/shopping-list", shoppingListRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Recipe Hub API running on http://localhost:${PORT}`);
});
