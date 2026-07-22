const WorkOrder = require('../models/WorkOrder');
const Equipment = require('../models/Equipment');
const FailureIntelligenceAgent = require('../agents/FailureIntelligenceAgent');

// @desc    Get Maintenance Workspace Overview & Metrics
// @route   GET /api/maintenance/metrics
// @access  Private (MAINTENANCE_TEAM, ADMIN)
exports.getMaintenanceMetrics = async (req, res, next) => {
  try {
    const equipment = await Equipment.find();
    const workOrders = await WorkOrder.find().sort({ createdAt: -1 });

    const totalEquipment = equipment.length;
    const operationalCount = equipment.filter(e => e.status === 'OPERATIONAL').length;
    const maintenanceCount = equipment.filter(e => e.status === 'MAINTENANCE' || e.status === 'OFFLINE').length;
    const avgHealthScore = Math.round(equipment.reduce((acc, curr) => acc + curr.healthScore, 0) / (totalEquipment || 1));

    const todaysWorkOrders = workOrders.filter(w => w.status === 'IN_PROGRESS' || w.status === 'PENDING');
    const recentRepairs = workOrders.filter(w => w.status === 'COMPLETED');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEquipment,
          operationalCount,
          maintenanceCount,
          avgHealthScore,
          pendingWorkOrders: todaysWorkOrders.length
        },
        equipment,
        todaysWorkOrders,
        recentRepairs
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Work Orders
// @route   GET /api/maintenance/work-orders
// @access  Private (MAINTENANCE_TEAM, ADMIN)
exports.getWorkOrders = async (req, res, next) => {
  try {
    const workOrders = await WorkOrder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: workOrders });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept or Update Work Order Status
// @route   PUT /api/maintenance/work-orders/:id
// @access  Private (MAINTENANCE_TEAM, ADMIN)
exports.updateWorkOrder = async (req, res, next) => {
  try {
    const { status, repairNotes } = req.body;
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({ success: false, error: 'Work order not found' });
    }

    if (status) workOrder.status = status;
    if (repairNotes) workOrder.repairNotes = repairNotes;
    if (status === 'COMPLETED') workOrder.completedAt = new Date();

    await workOrder.save();

    // If completed, update equipment health score
    if (status === 'COMPLETED') {
      const eq = await Equipment.findOne({ equipmentId: workOrder.equipmentId });
      if (eq) {
        eq.status = 'OPERATIONAL';
        eq.healthScore = Math.min(100, eq.healthScore + 35);
        await eq.save();
      }
    }

    res.status(200).json({ success: true, data: workOrder });
  } catch (err) {
    next(err);
  }
};

// @desc    Get AI Failure Risk Predictions for Maintenance
// @route   GET /api/maintenance/predictions
// @access  Private (MAINTENANCE_TEAM, ADMIN)
exports.getFailurePredictions = async (req, res, next) => {
  try {
    const equipmentList = await Equipment.find();
    const predictions = equipmentList.map(eq => ({
      equipmentId: eq.equipmentId,
      equipmentName: eq.name,
      healthScore: eq.healthScore,
      riskLevel: eq.healthScore < 50 ? 'HIGH' : eq.healthScore < 75 ? 'MEDIUM' : 'LOW',
      predictedFailureDays: eq.healthScore < 50 ? 3 : eq.healthScore < 75 ? 14 : 60,
      recommendedAction: eq.healthScore < 50 ? 'Inspect seal alignment & hydraulic pump line' : 'Standard lubrication check'
    }));

    res.status(200).json({ success: true, data: predictions });
  } catch (err) {
    next(err);
  }
};
