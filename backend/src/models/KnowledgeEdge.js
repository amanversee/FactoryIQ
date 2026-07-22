const mongoose = require('mongoose');

const KnowledgeEdgeSchema = new mongoose.Schema({
  source: {
    type: mongoose.Schema.ObjectId,
    ref: 'KnowledgeNode',
    required: true
  },
  target: {
    type: mongoose.Schema.ObjectId,
    ref: 'KnowledgeNode',
    required: true
  },
  relation: {
    type: String, // e.g., 'REFERENCES', 'PART_OF', 'MAINTAINS', 'CAUSES'
    required: true
  },
  weight: {
    type: Number,
    default: 1.0
  }
});

module.exports = mongoose.model('KnowledgeEdge', KnowledgeEdgeSchema);
