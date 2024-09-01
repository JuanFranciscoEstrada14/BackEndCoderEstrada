// src/config/logger.js

const winston = require('winston');
const { format, createLogger, transports } = winston;

// Define el nivel de logging
const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5
};

// Configuración común para todos los logs
const commonOptions = {
  format: format.combine(
    format.timestamp(),
    format.json()
  )
};

// Configuración para desarrollo
const devLogger = createLogger({
  level: 'debug',
  levels: logLevels,
  transports: [
    new transports.Console({
      ...commonOptions,
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Configuración para producción
const prodLogger = createLogger({
  level: 'info',
  levels: logLevels,
  transports: [
    new transports.Console({
      ...commonOptions,
      format: format.simple()
    }),
    new transports.File({
      filename: 'errors.log',
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
});

// Exporta el logger basado en el entorno
module.exports = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
