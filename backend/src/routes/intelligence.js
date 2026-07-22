const express = require('express');
const { analyzeEquipment, auditCompliance, analyzeFailure } = require('../controllers/intelligence');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/maintenance/:equipmentId', authorize('ADMIN', 'ENGINEER', 'MAINTENANCE_TEAM'), analyzeEquipment);
router.post('/compliance', authorize('ADMIN', 'AUDITOR'), auditCompliance);
router.post('/failure', authorize('ADMIN', 'ENGINEER', 'MAINTENANCE_TEAM'), analyzeFailure);

module.exports = router;
