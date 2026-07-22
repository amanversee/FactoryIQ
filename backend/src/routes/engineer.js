const express = require('express');
const {
  getEngineerMetrics,
  createInspection,
  getInspections
} = require('../controllers/engineer');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('ENGINEER', 'ADMIN'));

router.get('/metrics', getEngineerMetrics);
router.get('/inspections', getInspections);
router.post('/inspections', createInspection);

module.exports = router;
