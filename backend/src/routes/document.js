const express = require('express');
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/document');
const upload = require('../middlewares/upload');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply protection to all document routes
router.use(protect);

router
  .route('/')
  .get(getDocuments)
  .post(authorize('ADMIN', 'ENGINEER'), upload.single('file'), uploadDocument);

router
  .route('/:id')
  .delete(authorize('ADMIN'), deleteDocument);

module.exports = router;
