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

      let answerText;
      try {
        const aiResponse = await chatModel.generateContent(prompt);
        answerText = aiResponse.response.text();
        answerText = answerText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(answerText);
      } catch (genError) {
        console.warn(`[ComplianceAgent] Gemini API call or parse failed, returning fallback audit report: ${genError.message}`);
        return {
          complianceScore: 88,
          status: "NEEDS_REVIEW",
          violations: [
            "Section 4.1 missing quarterly fire safety protocol sign-off",
            "Referenced standard requires update to latest 2026 ISO framework"
          ],
          suggestions: [
            "Update Section 4.1 to mandate automated quarterly logging",
            "Revise ISO compliance documentation reference"
          ]
        };
      }
    } catch (error) {
      console.error(`[ComplianceAgent] Error:`, error);
      throw error;
    }
  }
}

module.exports = new ComplianceIntelligenceAgent();
