const express = require('express');
const {
  getAdminMetrics,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getDepartments,
  createDepartment,
  getSystemLogs
} = require('../controllers/admin');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/metrics', getAdminMetrics);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.get('/logs', getSystemLogs);

module.exports = router;
