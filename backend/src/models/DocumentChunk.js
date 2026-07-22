const mongoose = require('mongoose');

const DocumentChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Document',
    required: true,
  },
  chunkIndex: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Gemini embedding vector (768 dimensions usually for text-embedding-004)
  embedding: {
    type: [Number],
    required: true,
  },
  metadata: {
    // Page number, section, equipment referenced, etc.
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Note: In MongoDB Atlas, you must manually create a Search Index 
// of type 'vectorSearch' on the 'embedding' field.
module.exports = mongoose.model('DocumentChunk', DocumentChunkSchema);
