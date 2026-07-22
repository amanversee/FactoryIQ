const { GoogleGenerativeAI } = require('@google/generative-ai');
const DocumentChunk = require('../models/DocumentChunk');
const Document = require('../models/Document');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

class KnowledgeAgent {
  async query(question, role = 'ENGINEER', filters = {}) {
    try {
      console.log(`[KnowledgeAgent] Processing query for role [${role}]: "${question}"`);

      let roleDirective = "Answer technical engineering queries based on manuals, SOPs, and equipment drawings.";
      if (role === 'MAINTENANCE_TEAM') {
        roleDirective = "Focus on equipment troubleshooting, failure risks, repair steps, component replacement, and maintenance history.";
      } else if (role === 'AUDITOR') {
        roleDirective = "Focus on regulatory compliance, ISO 9001/45001 standards, OSHA, audit logs, and safety violations.";
      } else if (role === 'ADMIN') {
        roleDirective = "Provide executive system overviews, user activity metrics, platform status, and operational summaries.";
      }

      // 1. Create embedding for the question
      const embeddingResult = await embeddingModel.embedContent(question);
      const queryEmbedding = embeddingResult.embedding.values;

      // 2. Perform Vector Search using MongoDB aggregation
      const pipeline = [
        {
          $vectorSearch: {
            index: 'vector_index',
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 5
          }
        },
        {
          $project: {
            _id: 1,
            documentId: 1,
            text: 1,
            score: { $meta: 'vectorSearchScore' }
          }
        }
      ];

      const searchResults = await DocumentChunk.aggregate(pipeline);

      if (searchResults.length === 0) {
        return {
          answer: `[${role} AI Assistant]: I couldn't find relevant indexed document chunks. Based on standard plant knowledge: Please ensure maintenance logs and equipment manuals are uploaded to the Knowledge Base.`,
          sources: []
        };
      }

      // 3. Retrieve Context & Formulate Prompt
      let context = '';
      const sources = [];

      for (const result of searchResults) {
        const doc = await Document.findById(result.documentId).select('title fileUrl category');
        if (doc) {
          context += `\n--- SOURCE: ${doc.title} ---\n${result.text}\n`;
          sources.push({
            documentId: doc._id,
            title: doc.title,
            fileUrl: doc.fileUrl,
            similarityScore: result.score
          });
        }
      }

      const prompt = `
        You are FactoryIQ ${role} AI Assistant, an AI-Powered Industrial Knowledge Agent tailored for the ${role} persona.
        PERSPECTIVE INSTRUCTIONS: ${roleDirective}
        Your goal is to answer the user's question using the provided SOURCE information below.
        Provide a structured, highly professional response suitable for an enterprise industrial platform.
        At the end, suggest a "Recommended Action" suitable for a ${role}.

        SOURCES:
        ${context}

        USER QUESTION:
        ${question}
      `;

      // 4. Generate Answer using Gemini
      const aiResponse = await chatModel.generateContent(prompt);
      const answer = aiResponse.response.text();

      // Ensure unique sources
      const uniqueSources = Array.from(new Set(sources.map(a => a.documentId.toString())))
        .map(id => sources.find(a => a.documentId.toString() === id));

      return {
        answer,
        sources: uniqueSources
      };

    } catch (error) {
      console.error(`[KnowledgeAgent] Error during query:`, error);
      throw error;
    }
  }
}

module.exports = new KnowledgeAgent();
