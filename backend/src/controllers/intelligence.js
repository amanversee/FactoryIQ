const maintenanceAgent = require('../agents/MaintenanceIntelligenceAgent');
const complianceAgent = require('../agents/ComplianceIntelligenceAgent');
const failureAgent = require('../agents/FailureIntelligenceAgent');

exports.analyzeEquipment = async (req, res, next) => {
  try {
    const analysis = await maintenanceAgent.analyzeEquipmentHealth(req.params.equipmentId);
    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
};

exports.auditCompliance = async (req, res, next) => {
  try {
    const { sopId, regulationId } = req.body;
    const report = await complianceAgent.auditCompliance(sopId, regulationId);
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

exports.analyzeFailure = async (req, res, next) => {
  try {
    const { description } = req.body;
    const analysis = await failureAgent.analyzeFailure(description);
    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
};
