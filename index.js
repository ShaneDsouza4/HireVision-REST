const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models"); // Import sequelize instance
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Enable CORS
app.use(cors());

// Middleware for JSON parsing
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HireVision API Documentation",
      version: "1.0.0",
      description: "API documentation for the HireVision backend",
    },
    servers: [
      {
        url: "http://localhost:3000", // Replace with production URL if needed
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to route files for auto-documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Import routes
const businessAreaRoutes = require("./routes/businessArea");
const jobRoutes = require("./routes/job");
const tagRoutes = require("./routes/tag");
const intervieweeRoutes = require("./routes/interviewee");
const interviewerRoutes = require("./routes/interviewer");
const interviewRoutes = require("./routes/interview");
const authRoutes = require("./routes/auth");

// Use Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync with database:", err.message);
  });
