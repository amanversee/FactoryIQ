const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const connectDB = require('./config/db');
const socketConfig = require('./utils/socket');
const errorHandler = require('./middlewares/error');
const logger = require('./utils/logger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use(helmet({
  contentSecurityPolicy: false
}));

// Sanitize data (Express 5 compatible)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // 100 requests per 10 mins
});
app.use(limiter);

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FactoryIQ API is running.' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/document'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/intelligence', require('./routes/intelligence'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/engineer', require('./routes/engineer'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/auditor', require('./routes/auditor'));

// Serve static assets in production or when frontend dist exists
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  });
}

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Initialize Socket.io
const io = socketConfig.init(server);
io.on('connection', socket => {
  logger.info(`Client connected to socket: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
