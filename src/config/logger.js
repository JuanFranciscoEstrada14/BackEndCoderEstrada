const winston = require('winston');
const { format, createLogger, transports } = winston;


const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5
};


const commonOptions = {
  format: format.combine(
    format.timestamp(),
    format.json()
  )
};

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

module.exports = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
