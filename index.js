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
const jobRoutes = require("./routes/job");
const tagRoutes = require("./routes/tag");
const intervieweeRoutes = require("./routes/interviewee");
const interviewerRoutes = require("./routes/interviewer");
const interviewRoutes = require("./routes/interview");
const authRoutes = require("./routes/auth");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/businessareas", businessAreaRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/interviewees", intervieweeRoutes);
app.use("/api/interviewers", interviewerRoutes);
app.use("/api/interviews", interviewRoutes);

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
