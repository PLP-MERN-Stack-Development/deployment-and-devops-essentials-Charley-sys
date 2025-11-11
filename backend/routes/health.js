const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/detailed', async (req, res) => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'Unknown',
    environment: process.env.NODE_ENV
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    healthcheck.database = dbState === 1 ? 'Connected' : 'Disconnected';
    
    if (dbState !== 1) {
      healthcheck.status = 'Degraded';
    }

    res.status(healthcheck.status === 'OK' ? 200 : 503).json(healthcheck);
  } catch (error) {
    healthcheck.status = 'Error';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
});

module.exports = router;