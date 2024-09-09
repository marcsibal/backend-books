import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import morgan from 'morgan';
import api from './routes/api-1.0.0.js';
import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();

// Setup app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

// Set port
const port = process.env.PORT || '9100';

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.all('/*', (req, res, next) => {
  res.setTimeout(1200000, function(){
    console.log('Request has timed out.');
    res.sendStatus(408);
  });  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// SECURITY
app.disable('x-powered-by');

// Routes
api(app);

// Database setup (assuming this is an ES module)
import db from './config/database.js';
global.db = db;

// START SERVER
app.set('port', port);
server.listen(port, '127.0.0.1', () => {
  console.log('V: ' + process.env.VERSION + ' PORT: ' + port);
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

// Handle any other routes
app.get("*", (req, res) => {
  res.redirect('/');
});

export default app;
