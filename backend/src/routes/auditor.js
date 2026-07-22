const express = require('express');
const {
  getAuditorMetrics,
  runComplianceAudit,
  getAuditReports
} = require('../controllers/auditor');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('AUDITOR', 'ADMIN'));

router.get('/metrics', getAuditorMetrics);
router.post('/run-audit', runComplianceAudit);
router.get('/reports', getAuditReports);

module.exports = router;
