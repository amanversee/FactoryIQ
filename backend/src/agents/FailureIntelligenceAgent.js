const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

class FailureIntelligenceAgent {
  /**
   * Analyzes an incident description and finds the root cause and historical resolutions.
   */
  async analyzeFailure(incidentDescription) {
    try {
      const prompt = `
        You are the FactoryIQ Failure Intelligence Agent.
        Analyze the following incident description:
        "${incidentDescription}"
        
        Provide a JSON response with a Root Cause Analysis (RCA):
        {
          "rootCause": "Brief description of likely root cause",
          "riskScore": 75,
          "historicalResolutions": [
            "Replaced worn O-rings",
            "Recalibrated pressure sensor"
          ],
          "recommendedActions": [
            "Shut down the line immediately",
            "Inspect hydraulic seals"
          ]
        }
      `;

      const aiResponse = await chatModel.generateContent(prompt);
      let answerText = aiResponse.response.text();
      
      answerText = answerText.replace(/```json/g, '').replace(/```/g, '').trim();
      const analysis = JSON.parse(answerText);

      return analysis;
    } catch (error) {
      console.error(`[FailureAgent] Error:`, error);
      throw error;
    }
  }
}

module.exports = new FailureIntelligenceAgent();
