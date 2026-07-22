const User = require('../models/User');
const Department = require('../models/Department');
const Equipment = require('../models/Equipment');
const Document = require('../models/Document');
const SystemLog = require('../models/SystemLog');
const WorkOrder = require('../models/WorkOrder');

// @desc    Get Admin Dashboard KPI Overview & Metrics
// @route   GET /api/admin/metrics
// @access  Private (ADMIN)
exports.getAdminMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const departmentsCount = await Department.countDocuments();
    const equipmentCount = await Equipment.countDocuments();
    const documentsCount = await Document.countDocuments();
    const pendingWorkOrders = await WorkOrder.countDocuments({ status: { $in: ['PENDING', 'IN_PROGRESS'] } });
    const recentLogs = await SystemLog.find().sort({ timestamp: -1 }).limit(10);
    const usersList = await User.find().select('-password');

    res.status(200).json({
      success: true,
      data: {
        systemHealth: {
          status: 'OPERATIONAL',
          uptime: '99.98%',
          cpuLoad: '14%',
          memoryUsage: '3.2 GB / 16 GB',
          activeClusterNodes: 4
        },
        metrics: {
          totalUsers,
          departmentsCount,
          equipmentCount,
          documentsCount,
          aiTokensUsed: 148290,
          pendingAiJobs: 2,
          pendingWorkOrders
        },
        users: usersList,
        recentLogs
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private (ADMIN)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Create User (Admin action)
// @route   POST /api/admin/users
// @access  Private (ADMIN)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Please provide both name and email' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'A user with this email address already exists' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: (password && password.trim().length >= 6) ? password.trim() : 'User@12345',
      role: role || 'ENGINEER',
      department: department || 'General'
    });

    try {
      await SystemLog.create({
        action: 'USER_CREATED',
        module: 'AUTH',
        performedBy: req.user ? req.user.name : 'System Admin',
        role: req.user ? req.user.role : 'ADMIN',
        details: `Created new user ${newUser.name} (${newUser.email}) with role ${newUser.role}`
      });
    } catch (logErr) {
      console.error('Non-critical system log error:', logErr);
    }

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update User Role or Info
// @route   PUT /api/admin/users/:id
// @access  Private (ADMIN)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, department, name } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (role) user.role = role;
    if (department) user.department = department;
    if (name) user.name = name;

    await user.save();

    await SystemLog.create({
      action: 'USER_UPDATED',
      module: 'AUTH',
      performedBy: req.user.name,
      role: req.user.role,
      details: `Updated user ${user.email} (Role: ${user.role})`
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private (ADMIN)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await user.deleteOne();

    await SystemLog.create({
      action: 'USER_DELETED',
      module: 'AUTH',
      performedBy: req.user.name,
      role: req.user.role,
      details: `Deleted user ${user.email}`
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Departments
// @route   GET /api/admin/departments
// @access  Private (ADMIN)
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
};

// @desc    Create Department
// @route   POST /api/admin/departments
// @access  Private (ADMIN)
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, code, headOfDepartment } = req.body;
    const department = await Department.create({ name, code, headOfDepartment });
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

// @desc    Get System Logs
// @route   GET /api/admin/logs
// @access  Private (ADMIN)
exports.getSystemLogs = async (req, res, next) => {
  try {
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};
