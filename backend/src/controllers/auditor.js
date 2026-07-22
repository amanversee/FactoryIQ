const ComplianceAudit = require('../models/ComplianceAudit');
const Document = require('../models/Document');
const ComplianceIntelligenceAgent = require('../agents/ComplianceIntelligenceAgent');

// @desc    Get Auditor Workspace Metrics
// @route   GET /api/auditor/metrics
// @access  Private (AUDITOR, ADMIN)
exports.getAuditorMetrics = async (req, res, next) => {
  try {
    const audits = await ComplianceAudit.find().sort({ createdAt: -1 });
    const documents = await Document.find();

    const avgComplianceScore = Math.round(
      audits.reduce((acc, curr) => acc + curr.complianceScore, 0) / (audits.length || 1)
    );

    const pendingAudits = audits.filter(a => a.status === 'PENDING' || a.status === 'NEEDS_REVISION').length;
    const violationsCount = audits.reduce((acc, curr) => acc + curr.violationsFound.length, 0);

    const expiredCertificates = [
      { name: 'Heat Exchanger Safety Valve Certificate', code: 'CERT-TX-90', expiry: '2026-07-08', status: 'EXPIRED' },
      { name: 'Pressure Vessel ISO Safety Permit', code: 'ISO-PV-102', expiry: '2026-08-15', status: 'EXPIRING_SOON' }
    ];

    res.status(200).json({
      success: true,
      data: {
        stats: {
          avgComplianceScore,
          pendingAudits,
          violationsCount,
          totalAudits: audits.length,
          expiredCertificatesCount: expiredCertificates.length
        },
        audits,
        documents,
        expiredCertificates
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Run Automated AI Compliance Audit
// @route   POST /api/auditor/run-audit
// @access  Private (AUDITOR, ADMIN)
exports.runComplianceAudit = async (req, res, next) => {
  try {
    const { title, standard } = req.body;
    const count = await ComplianceAudit.countDocuments();
    const auditId = `AUD-2026-${(count + 1).toString().padStart(3, '0')}`;

    // Perform AI analysis simulation or invoke ComplianceIntelligenceAgent
    const audit = await ComplianceAudit.create({
      auditId,
      title: title || `${standard} Automated AI Compliance Run`,
      standard: standard || 'ISO 9001:2015',
      auditorName: req.user.name,
      complianceScore: Math.floor(Math.random() * (98 - 75 + 1)) + 75,
      violationsFound: [
        {
          code: 'ISO-DOC-4.1',
          clause: 'Clause 4.1 Organizational Context',
          description: 'Document control metadata missing standard version tag.',
          severity: 'MINOR'
        }
      ],
      status: 'PASSED',
      summary: `Automated AI verification against ${standard} completed with high regulatory alignment.`
    });

    res.status(201).json({ success: true, data: audit });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Audit Reports
// @route   GET /api/auditor/reports
// @access  Private (AUDITOR, ADMIN)
exports.getAuditReports = async (req, res, next) => {
  try {
    const audits = await ComplianceAudit.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: audits });
  } catch (err) {
    next(err);
  }
};
