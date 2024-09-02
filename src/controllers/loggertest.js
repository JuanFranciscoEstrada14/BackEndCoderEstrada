const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/', (req, res) => {
  logger.debug('This is a debug message');
  logger.http('This is an http message');
  logger.info('This is an info message');
  logger.warning('This is a warning message');
  logger.error('This is an error message');
  logger.fatal('This is a fatal message');

  res.send('Logger test messages have been logged');
});

module.exports = router;
