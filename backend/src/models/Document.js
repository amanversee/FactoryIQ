const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a document title'],
    trim: true,
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide the file URL'],
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  fileType: {
    type: String, // e.g., 'application/pdf', 'image/png'
    required: true,
  },
  category: {
    type: String,
    enum: ['MANUAL', 'SOP', 'DRAWING', 'REPORT', 'LOG', 'REGULATION', 'OTHER'],
    default: 'OTHER'
  },
  department: {
    type: String,
  },
  equipment: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Equipment'
  }],
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  processingStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  metadata: {
    // Extracted metadata like page count, dates, identified keywords
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

DocumentSchema.index({ processingStatus: 1 });
DocumentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Document', DocumentSchema);
