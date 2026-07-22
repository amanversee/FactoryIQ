const mongoose = require('mongoose');

const SystemLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  module: {
    type: String,
    enum: ['AUTH', 'SYSTEM', 'DOCUMENTS', 'AI_ENGINE', 'EQUIPMENT', 'COMPLIANCE'],
    default: 'SYSTEM'
  },
  performedBy: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'WARNING', 'ERROR'],
    default: 'SUCCESS'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SystemLog', SystemLogSchema);
