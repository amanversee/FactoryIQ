const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add equipment name'],
    trim: true,
  },
  equipmentId: {
    type: String,
    required: [true, 'Please add a unique equipment identifier'],
    unique: true,
  },
  department: {
    type: String,
    required: [true, 'Please specify the department'],
  },
  type: {
    type: String,
    required: [true, 'Please specify equipment type'],
  },
  status: {
    type: String,
    enum: ['OPERATIONAL', 'MAINTENANCE', 'DOWN', 'DECOMMISSIONED'],
    default: 'OPERATIONAL'
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastMaintenanceDate: {
    type: Date,
  },
  nextMaintenanceDate: {
    type: Date,
  },
  documents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Document'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

EquipmentSchema.index({ status: 1 });

module.exports = mongoose.model('Equipment', EquipmentSchema);
