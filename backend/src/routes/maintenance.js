const express = require('express');
const {
  getMaintenanceMetrics,
  getWorkOrders,
  updateWorkOrder,
  getFailurePredictions
} = require('../controllers/maintenance');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('MAINTENANCE_TEAM', 'ADMIN'));

router.get('/metrics', getMaintenanceMetrics);
router.get('/work-orders', getWorkOrders);
router.put('/work-orders/:id', updateWorkOrder);
router.get('/predictions', getFailurePredictions);

module.exports = router;
