const Document = require('../models/Document');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

class ComplianceIntelligenceAgent {
  /**
   * Compares a company SOP against an uploaded regulation document.
   */
  async auditCompliance(sopDocumentId, regulationDocumentId) {
    try {
      // In a real implementation, we would use the Vector Search / KnowledgeAgent
      // to retrieve specific chunks of both documents for a detailed gap analysis.
      // For this prototype, we'll simulate the AI reasoning.

      const prompt = `
        You are the FactoryIQ Compliance Auditor AI.
        Your task is to compare a Standard Operating Procedure (SOP) against a Regulatory Standard.
        
        Generate a JSON response with a simulated gap analysis:
        {
          "complianceScore": 88,
          "status": "PASS" | "FAIL" | "NEEDS_REVIEW",
          "violations": [
            "Section 4.1 missing fire safety protocol",
            "Outdated reference to ISO 9001:2008"
          ],
          "suggestions": [
            "Update Section 4.1 to include extinguisher checks",
            "Revise ISO references to the 2015 standard"
          ]
        }
      `;

      const aiResponse = await chatModel.generateContent(prompt);
      let answerText = aiResponse.response.text();
      
      answerText = answerText.replace(/```json/g, '').replace(/```/g, '').trim();
      const report = JSON.parse(answerText);

      return report;
    } catch (error) {
      console.error(`[ComplianceAgent] Error:`, error);
      throw error;
    }
  }
}

module.exports = new ComplianceIntelligenceAgent();
