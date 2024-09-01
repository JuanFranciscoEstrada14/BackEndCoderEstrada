// src/config/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación de la API',
      version: '1.0.0',
      description: 'Documentación de la API para el proyecto final',
    },
    servers: [
      {
        url: 'http://localhost:8080', // Cambia esto si tu servidor corre en otra dirección
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
