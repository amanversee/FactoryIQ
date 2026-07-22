const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  inspectionId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  equipmentId: {
    type: String,
    required: true
  },
  equipmentName: {
    type: String,
    required: true
  },
  inspectorName: {
    type: String,
    required: true
  },
  findings: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['ROUTINE', 'INCIDENT_REPORT', 'SAFETY_AUDIT', 'PERFORMANCE_CHECK'],
    default: 'ROUTINE'
  },
  severity: {
    type: String,
    enum: ['MINOR', 'MODERATE', 'CRITICAL', 'NONE'],
    default: 'NONE'
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'RESOLVED'],
    default: 'SUBMITTED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inspection', InspectionSchema);
