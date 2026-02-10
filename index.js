const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. Performance Metrics (Challenge 2) ---
// Objekt för att spara statistik
const metrics = {
  requests: 0,
  startTime: Date.now(),
  lastRequestTime: null
};

// Middleware som körs före varje request
app.use((req, res, next) => {
  metrics.requests++;
  metrics.lastRequestTime = Date.now();
  
  // Mät svarstiden (Response Time)
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  
  next();
});

// Endpoint för att se metrics
app.get('/metrics', (req, res) => {
  const uptime = Math.floor((Date.now() - metrics.startTime) / 1000); // Uptime i sekunder
  
  res.json({
    totalRequests: metrics.requests,
    uptimeSeconds: uptime,
    lastRequest: metrics.lastRequestTime ? new Date(metrics.lastRequestTime).toISOString() : 'Never',
    status: 'healthy'
  });
});

// --- 2. Custom Health Check (Challenge 4) ---
app.get('/health', async (req, res) => {
  // Simulera en databaskontroll (eftersom vi inte har en riktig DB än)
  const dbStatus = await checkDatabaseConnection();
  
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: [
      {
        name: 'Database',
        status: dbStatus ? 'UP' : 'DOWN', // Visar om "databasen" svarar
      },
      {
        name: 'Server',
        status: 'UP',
        memoryUsage: process.memoryUsage().rss // Visar hur mycket minne servern drar
      }
    ]
  };

  // Om databasen är nere, returnera 503 (Service Unavailable)
  if (!dbStatus) {
    res.status(503).send(healthCheck);
  } else {
    res.status(200).send(healthCheck);
  }
});

// Simulerad databas-check funktion
function checkDatabaseConnection() {
  return new Promise((resolve) => {
    // 99% chans att den fungerar, 1% risk för fel (för att testa)
    const isConnected = Math.random() > 0.01; 
    setTimeout(() => resolve(isConnected), 100);
  });
}

// --- Befintliga endpoints ---
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Pipeline Challenge);
});

// Starta servern
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;