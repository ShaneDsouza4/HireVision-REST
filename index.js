const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models"); // Import sequelize instance

// Enable CORS
app.use(cors());

// Middleware for JSON parsing
app.use(express.json());

// Import routes
const businessAreaRoutes = require("./routes/businessArea");
const interviewerRoutes = require("./routes/interviewer");

// Use routes
app.use("/api/businessareas", businessAreaRoutes);
app.use("/api/interviewers", interviewerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Sync Sequelize and start server
const PORT = process.env.PORT || 3000;
sequelize
  .sync({ force: false }) // 'force: true' will drop and re-create tables
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync with database:", err.message);
  });
