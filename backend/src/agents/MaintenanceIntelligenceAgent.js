const Equipment = require('../models/Equipment');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const socketUtils = require('../utils/socket');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

class MaintenanceIntelligenceAgent {
  /**
   * Analyzes an equipment's health and maintenance logs to predict failures.
   */
  async analyzeEquipmentHealth(equipmentId) {
    try {
      const equipment = await Equipment.findOne({ equipmentId }).populate('documents');
      if (!equipment) {
        throw new Error('Equipment not found');
      }

      // In a real scenario, we'd fetch telemetry data, recent incident reports, and past maintenance logs.
      // For this prototype, we'll construct a mock context based on the equipment data.
      const prompt = `
        You are the FactoryIQ Maintenance Intelligence Agent.
        Analyze the following equipment profile and predict its health score (0-100), 
        Remaining Useful Life (RUL), and recommend preventive maintenance actions.

        Equipment Name: ${equipment.name}
        Type: ${equipment.type}
        Current Status: ${equipment.status}
        Last Maintenance: ${equipment.lastMaintenanceDate || 'Unknown'}
        
        Provide a JSON response with the following structure exactly:
        {
          "healthScore": 85,
          "failureRisk": "Low" | "Medium" | "High",
          "remainingUsefulLifeDays": 120,
          "recommendations": ["Action 1", "Action 2"]
        }
      `;

      const aiResponse = await chatModel.generateContent(prompt);
      let answerText = aiResponse.response.text();
      
      // Clean up markdown formatting if Gemini returns it
      answerText = answerText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let analysis;
      try {
        analysis = JSON.parse(answerText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', answerText);
        throw new Error('AI returned malformed JSON');
      }

      // Update the equipment with the new AI-derived health score
      equipment.healthScore = analysis.healthScore;
      await equipment.save();

      // Emit a realtime alert if risk is High
      if (analysis.failureRisk === 'High') {
        socketUtils.sendNotification('maintenance-alert', {
          equipment: equipment.name,
          risk: 'High',
          message: 'Immediate inspection recommended.'
        });
      }

      return analysis;
    } catch (error) {
      console.error(`[MaintenanceAgent] Error:`, error);
      throw error;
    }
  }
}

module.exports = new MaintenanceIntelligenceAgent();
