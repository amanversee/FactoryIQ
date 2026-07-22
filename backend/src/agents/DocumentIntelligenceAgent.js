const axios = require('axios');
const pdfParse = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const DocumentChunk = require('../models/DocumentChunk');
const KnowledgeNode = require('../models/KnowledgeNode');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

class DocumentIntelligenceAgent {
  async processDocument(document) {
    try {
      console.log(`[Agent] Starting processing for document: ${document.title}`);
      
      // 1. Download file content from Cloudinary URL
      const response = await axios.get(document.fileUrl, { responseType: 'arraybuffer' });
      const buffer = response.data;

      // 2. Extract Text (assuming PDF for now based on Phase 3 simplified scope)
      let rawText = '';
      if (document.fileType === 'application/pdf') {
        const data = await pdfParse(buffer);
        rawText = data.text;
      } else {
        // Fallback or handle other types (Word/Excel) later
        rawText = buffer.toString('utf-8');
      }

      if (!rawText || rawText.trim() === '') {
        throw new Error('No extractable text found in document.');
      }

      // 3. Chunk the text
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.createDocuments([rawText]);

      console.log(`[Agent] Generated ${chunks.length} chunks. Creating embeddings...`);

      // 4. Generate Embeddings & Save to MongoDB (Batched)
      const batchSize = 10;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        
        const embedPromises = batch.map(async (chunk, idx) => {
          const chunkText = chunk.pageContent;
          // Implement retry logic in a real prod app for rate limits
          const embeddingResult = await embeddingModel.embedContent(chunkText);
          const embedding = embeddingResult.embedding.values;
          
          return {
            documentId: document._id,
            chunkIndex: i + idx,
            text: chunkText,
            embedding: embedding,
            metadata: { length: chunkText.length }
          };
        });

        const batchResults = await Promise.all(embedPromises);
        await DocumentChunk.insertMany(batchResults);
      }

      // 5. Create Knowledge Graph Node for Document
      await KnowledgeNode.create({
        type: 'Document',
        label: document.title,
        referenceId: document._id,
        properties: { category: document.category, department: document.department }
      });

      console.log(`[Agent] Finished processing document: ${document.title}`);
      return true;
    } catch (error) {
      console.error(`[Agent] Error processing document:`, error);
      throw error;
    }
  }
}

module.exports = new DocumentIntelligenceAgent();
