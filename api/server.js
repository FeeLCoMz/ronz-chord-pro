// server.js
// Express server for API testing (CommonJS)
const express = require('express');
const bodyParser = require('body-parser');
const setlistsHandler = require('./setlists/index.js').default;
const songsHandler = require('./songs/index.js').default;
const eventsHandler = require('./events/index.js').default;
const bandsHandler = require('./bands/index.js').default;

const app = express();
app.use(bodyParser.json());

// Unified events endpoint
app.all('/api/events/:type/:id?', (req, res) => eventsHandler(req, res));

app.all('/api/setlists', (req, res) => setlistsHandler(req, res));
app.all('/api/songs', (req, res) => songsHandler(req, res));
// Remove old gigs endpoint
app.all('/api/bands', (req, res) => bandsHandler(req, res));

module.exports = app;
