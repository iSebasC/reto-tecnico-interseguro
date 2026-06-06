const express = require('express');
const pinoHttp = require('pino-http');

const statsRoutes = require('./infrastructure/http/routes/stats.routes');
const errorMiddleware = require('./infrastructure/http/middleware/error.middleware');

const app = express();

app.use(express.json());
app.use(pinoHttp());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-node' });
});

app.use('/api', statsRoutes);
app.use(errorMiddleware);

module.exports = app;
