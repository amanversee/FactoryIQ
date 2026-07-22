const mongoose = require('mongoose');

const ComplianceAuditSchema = new mongoose.Schema({
  auditId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  standard: {
    type: String,
    enum: ['ISO 9001:2015', 'ISO 45001:2018', 'OSHA Standard', 'Factory Act 1948', 'ISO 14001:2015'],
    required: true
  },
  auditorName: {
    type: String,
    default: 'Compliance Auditor'
  },
  complianceScore: {
    type: Number,
    required: true
  },
  violationsFound: [{
    code: String,
    clause: String,
    description: String,
    severity: {
      type: String,
      enum: ['MAJOR', 'MINOR', 'OBSERVATION']
    }
  }],
  status: {
    type: String,
    enum: ['PASSED', 'NEEDS_REVISION', 'FAILED', 'PENDING'],
    default: 'PENDING'
  },
  summary: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ComplianceAudit', ComplianceAuditSchema);
