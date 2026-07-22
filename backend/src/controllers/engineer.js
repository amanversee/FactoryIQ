const Document = require('../models/Document');
const KnowledgeNode = require('../models/KnowledgeNode');
const Inspection = require('../models/Inspection');
const Equipment = require('../models/Equipment');

// @desc    Get Engineer Workspace Overview
// @route   GET /api/engineer/metrics
// @access  Private (ENGINEER, ADMIN)
exports.getEngineerMetrics = async (req, res, next) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 }).limit(5);
    const knowledgeNodesCount = await KnowledgeNode.countDocuments();
    const inspections = await Inspection.find().sort({ createdAt: -1 });
    const equipment = await Equipment.find();

    const pendingReviews = inspections.filter(i => i.status === 'UNDER_REVIEW' || i.status === 'ACTION_REQUIRED').length;

    res.status(200).json({
      success: true,
      data: {
        documentsCount: await Document.countDocuments(),
        recentDocuments: documents,
        knowledgeNodesCount,
        inspections,
        equipment,
        pendingReviews,
        recentChats: [
          { query: 'Hydraulic Pump torque specs ISO 9001', time: '10m ago' },
          { query: 'Conveyor belt friction coefficient calculation', time: '1h ago' }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create Inspection Report
// @route   POST /api/engineer/inspections
// @access  Private (ENGINEER, ADMIN)
exports.createInspection = async (req, res, next) => {
  try {
    const { title, equipmentId, equipmentName, findings, type, severity } = req.body;
    const count = await Inspection.countDocuments();
    const inspectionId = `INS-2026-${(count + 1).toString().padStart(3, '0')}`;

    const inspection = await Inspection.create({
      inspectionId,
      title,
      equipmentId,
      equipmentName,
      inspectorName: req.user.name,
      findings,
      type: type || 'ROUTINE',
      severity: severity || 'NONE',
      status: severity === 'CRITICAL' ? 'ACTION_REQUIRED' : 'SUBMITTED'
    });

    res.status(201).json({ success: true, data: inspection });
  } catch (err) {
    next(err);
  }
};

// @desc    Get All Inspections & Incidents
// @route   GET /api/engineer/inspections
// @access  Private (ENGINEER, ADMIN)
exports.getInspections = async (req, res, next) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: inspections });
  } catch (err) {
    next(err);
  }
};
