const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models");

// CORS
app.use(cors());

// Middleware for JSON parsing
app.use(express.json());

// routes
const businessAreaRoutes = require("./routes/businessArea");
const jobRoutes = require("./routes/job");
const tagRoutes = require("./routes/tag");
const intervieweeRoutes = require("./routes/interviewee");
const interviewerRoutes = require("./routes/interviewer");
const interviewRoutes = require("./routes/interview");
const authRoutes = require("./routes/auth");

// Use routes
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});
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
let server;
sequelize
  .sync({ force: false }) // 'force: false' to avoid drop and re-create tables in production
  .then(() => {
    console.log("Database synced successfully.");
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync with database:", err.message);
  });

function closeServer() {
  server.close();
}

module.exports = { app, server, closeServer };
