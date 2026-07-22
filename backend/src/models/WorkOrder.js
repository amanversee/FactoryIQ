const mongoose = require('mongoose');

const WorkOrderSchema = new mongoose.Schema({
  workOrderId: {
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
  department: {
    type: String,
    default: 'Assembly'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'],
    default: 'PENDING'
  },
  assignedTo: {
    type: String,
    default: 'Maintenance Team'
  },
  failureRiskScore: {
    type: Number,
    default: 0
  },
  scheduledDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  repairNotes: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkOrder', WorkOrderSchema);
