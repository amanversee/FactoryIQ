const fs = require('fs');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const Document = require('../models/Document');
const { documentQueue } = require('../config/queue');

// @desc    Upload document
// @route   POST /api/documents
// @access  Private (ENGINEER, ADMIN)
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new Error('Please upload a file'));
    }

    const { title, category, department, equipmentIds } = req.body;

    // Upload to Cloudinary
    // Note: resource_type 'auto' handles pdfs, word docs, etc as well as images
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'factoryiq_documents',
      use_filename: true,
      unique_filename: true,
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    // Create document record in DB
    const document = await Document.create({
      title: title || req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      fileType: req.file.mimetype,
      category,
      department,
      uploadedBy: req.user.id,
      equipment: equipmentIds ? JSON.parse(equipmentIds) : [],
      processingStatus: 'PENDING'
    });

    // Enqueue the document for asynchronous background AI processing
    await documentQueue.add('process-document', {
      documentId: document._id
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (err) {
    // Cleanup local file if error happens after upload middleware
    if (req.file && fs.existsSync(req.file.path)) {
       fs.unlinkSync(req.file.path);
    }
    next(err);
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find()
      .populate('uploadedBy', 'name email')
      .populate('equipment', 'name equipmentId')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private (ADMIN, or document owner)
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return next(new Error(`Document not found with id of ${req.params.id}`));
    }

    // Optional: check user permissions here

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(document.cloudinaryId, { resource_type: 'auto' });

    await document.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
