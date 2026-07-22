const mongoose = require('mongoose');

const KnowledgeNodeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Document', 'Equipment', 'Department', 'Concept', 'Failure', 'Regulation'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  referenceId: {
    // ID of the actual document or equipment record
    type: mongoose.Schema.ObjectId,
  },
  properties: {
    type: mongoose.Schema.Types.Mixed
  }
});

KnowledgeNodeSchema.index({ type: 1 });
KnowledgeNodeSchema.index({ label: 1 });

module.exports = mongoose.model('KnowledgeNode', KnowledgeNodeSchema);
