require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Equipment = require('./src/models/Equipment');
const KnowledgeNode = require('./src/models/KnowledgeNode');
const WorkOrder = require('./src/models/WorkOrder');
const Inspection = require('./src/models/Inspection');
const ComplianceAudit = require('./src/models/ComplianceAudit');
const Department = require('./src/models/Department');
const SystemLog = require('./src/models/SystemLog');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/factoryiq';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany();
    await Equipment.deleteMany();
    await KnowledgeNode.deleteMany();
    await WorkOrder.deleteMany();
    await Inspection.deleteMany();
    await ComplianceAudit.deleteMany();
    await Department.deleteMany();
    await SystemLog.deleteMany();

    console.log('Cleared existing database collections.');

    // 1. Seed Users (All 4 Enterprise Roles)
    await User.create([
      {
        name: 'Aman Administrator',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'ADMIN',
        department: 'Executive Administration'
      },
      {
        name: 'Lead Industrial Engineer',
        email: 'engineer@company.com',
        password: 'engineer123',
        role: 'ENGINEER',
        department: 'Plant Operations'
      },
      {
        name: 'Senior Maintenance Lead',
        email: 'maintenance@company.com',
        password: 'maintenance123',
        role: 'MAINTENANCE_TEAM',
        department: 'Asset Maintenance'
      },
      {
        name: 'Chief Compliance Auditor',
        email: 'auditor@company.com',
        password: 'auditor123',
        role: 'AUDITOR',
        department: 'Quality Assurance'
      }
    ]);

    console.log('Seeded 4 Enterprise Role Users (ADMIN, ENGINEER, MAINTENANCE_TEAM, AUDITOR).');

    // 2. Seed Departments
    await Department.create([
      { name: 'Assembly Line A', code: 'DEP-ASM-01', headOfDepartment: 'Lead Industrial Engineer', userCount: 14, equipmentCount: 8 },
      { name: 'Packaging & Logistics', code: 'DEP-PKG-02', headOfDepartment: 'Ops Manager', userCount: 9, equipmentCount: 5 },
      { name: 'Quality Assurance', code: 'DEP-QA-03', headOfDepartment: 'Chief Compliance Auditor', userCount: 6, equipmentCount: 3 },
      { name: 'Asset Maintenance', code: 'DEP-MNT-04', headOfDepartment: 'Senior Maintenance Lead', userCount: 12, equipmentCount: 15 }
    ]);

    // 3. Seed Equipment Assets
    const eq1 = await Equipment.create({
      name: 'Conveyor Belt System A-10',
      type: 'Conveyor',
      equipmentId: 'EQ-001',
      department: 'Assembly Line A',
      status: 'OPERATIONAL',
      healthScore: 94
    });

    const eq2 = await Equipment.create({
      name: 'Hydraulic Pressure Pump P-102',
      type: 'Pump',
      equipmentId: 'EQ-002',
      department: 'Packaging & Logistics',
      status: 'MAINTENANCE',
      healthScore: 42
    });

    const eq3 = await Equipment.create({
      name: 'Robotic Welding Arm R-50',
      type: 'Robotics',
      equipmentId: 'EQ-003',
      department: 'Assembly Line A',
      status: 'OPERATIONAL',
      healthScore: 88
    });

    const eq4 = await Equipment.create({
      name: 'Thermal Heat Exchanger TX-90',
      type: 'Heat Exchanger',
      equipmentId: 'EQ-004',
      department: 'Asset Maintenance',
      status: 'OFFLINE',
      healthScore: 28
    });

    // 4. Seed Work Orders (Maintenance Team)
    await WorkOrder.create([
      {
        workOrderId: 'WO-2026-001',
        title: 'Hydraulic Seal Replacement & Pressure Check',
        equipmentId: 'EQ-002',
        equipmentName: 'Hydraulic Pressure Pump P-102',
        department: 'Packaging & Logistics',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assignedTo: 'Senior Maintenance Lead',
        failureRiskScore: 78,
        description: 'Vibration metrics detected fluid leak around seal housing. Replace high-pressure O-ring gaskets.',
        repairNotes: 'Disassembled pump casing. Replaced primary nitrile gasket.'
      },
      {
        workOrderId: 'WO-2026-002',
        title: 'Robotic Arm Calibration & Lubrication',
        equipmentId: 'EQ-003',
        equipmentName: 'Robotic Welding Arm R-50',
        department: 'Assembly Line A',
        priority: 'MEDIUM',
        status: 'PENDING',
        assignedTo: 'Senior Maintenance Lead',
        failureRiskScore: 24,
        description: 'Scheduled bi-weekly joint lubrication and axis position recalibration.'
      },
      {
        workOrderId: 'WO-2026-003',
        title: 'Emergency Thermal Sensor Replacement',
        equipmentId: 'EQ-004',
        equipmentName: 'Thermal Heat Exchanger TX-90',
        department: 'Asset Maintenance',
        priority: 'CRITICAL',
        status: 'PENDING',
        assignedTo: 'Senior Maintenance Lead',
        failureRiskScore: 92,
        description: 'Overheating warning emitted during peak operational cycle. Unit isolated.'
      }
    ]);

    // 5. Seed Inspections & Incidents (Engineer Role)
    await Inspection.create([
      {
        inspectionId: 'INS-2026-101',
        title: 'Pre-Shift Safety Walkthrough Assembly A',
        equipmentId: 'EQ-001',
        equipmentName: 'Conveyor Belt System A-10',
        inspectorName: 'Lead Industrial Engineer',
        findings: 'Emergency stop buttons operational. Belt tension verified at 450 N.',
        type: 'ROUTINE',
        severity: 'NONE',
        status: 'RESOLVED'
      },
      {
        inspectionId: 'INC-2026-042',
        title: 'Hydraulic Fluid Leak Incident Report',
        equipmentId: 'EQ-002',
        equipmentName: 'Hydraulic Pressure Pump P-102',
        inspectorName: 'Lead Industrial Engineer',
        findings: 'Secondary fluid leak identified near control valve joint B.',
        type: 'INCIDENT_REPORT',
        severity: 'CRITICAL',
        status: 'ACTION_REQUIRED'
      }
    ]);

    // 6. Seed Compliance Audits (Auditor Role)
    await ComplianceAudit.create([
      {
        auditId: 'AUD-2026-901',
        title: 'ISO 9001:2015 Quality SOP Compliance Check',
        standard: 'ISO 9001:2015',
        auditorName: 'Chief Compliance Auditor',
        complianceScore: 94.5,
        violationsFound: [
          { code: 'ISO-9001-4.2', clause: 'Clause 4.2 Document Control', description: 'Equipment inspection log missing supervisor signature for Q2.', severity: 'MINOR' }
        ],
        status: 'PASSED',
        summary: 'Plant operation heavily satisfies standard provisions with minor documentation signature requirement.'
      },
      {
        auditId: 'AUD-2026-902',
        title: 'ISO 45001 Safety Management Audit',
        standard: 'ISO 45001:2018',
        auditorName: 'Chief Compliance Auditor',
        complianceScore: 78.0,
        violationsFound: [
          { code: 'ISO-45001-8.1', clause: 'Clause 8.1 Operational Controls', description: 'Heat Exchanger safety relief valve calibration expired by 14 days.', severity: 'MAJOR' }
        ],
        status: 'NEEDS_REVISION',
        summary: 'Urgent recalibration required for Heat Exchanger TX-90 before certification renewal.'
      }
    ]);

    // 7. Seed System Logs (Admin Role)
    await SystemLog.create([
      { action: 'USER_LOGIN', module: 'AUTH', performedBy: 'Aman Administrator', role: 'ADMIN', details: 'Successful JWT authentication from IP 192.168.1.5' },
      { action: 'OCR_DOCUMENT_PROCESSED', module: 'DOCUMENTS', performedBy: 'Lead Industrial Engineer', role: 'ENGINEER', details: 'Extracted 42 pages from Hydraulic_Pump_Manual_v3.pdf' },
      { action: 'WORK_ORDER_ACCEPTED', module: 'EQUIPMENT', performedBy: 'Senior Maintenance Lead', role: 'MAINTENANCE_TEAM', details: 'Work Order WO-2026-001 status changed to IN_PROGRESS' },
      { action: 'COMPLIANCE_AI_RUN', module: 'COMPLIANCE', performedBy: 'Chief Compliance Auditor', role: 'AUDITOR', details: 'AI Audit execution on ISO 45001 completed with 78% score' }
    ]);

    // 8. Seed Knowledge Nodes
    await KnowledgeNode.create([
      { type: 'Equipment', label: 'Conveyor Belt System A-10', referenceId: eq1._id },
      { type: 'Equipment', label: 'Hydraulic Pressure Pump P-102', referenceId: eq2._id },
      { type: 'Department', label: 'Assembly Line A' },
      { type: 'Regulation', label: 'ISO 9001:2015' },
      { type: 'Regulation', label: 'ISO 45001:2018' }
    ]);

    console.log('Database successfully seeded with full enterprise RBAC mock dataset!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
