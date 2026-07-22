const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      if (!process.env.MONGO_URI) {
        logger.warn('MongoDB URI is not defined. Skipping database connection for now.');
        return;
      }
      const conn = await mongoose.connect(process.env.MONGO_URI);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      logger.error(`MongoDB Connection Error: ${error.message}`);
      retries -= 1;
      logger.info(`Retries left: ${retries}`);
      if (retries === 0) {
        logger.error('Failed to connect to MongoDB after 5 attempts.');
        process.exit(1);
      }
      // Wait 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
