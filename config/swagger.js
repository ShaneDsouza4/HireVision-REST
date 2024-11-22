const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HireVision API Documentation',
      version: '1.0.0',
      description: 'API documentation for the HireVision project',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update this based on your development and production environment
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files for automatic API documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
