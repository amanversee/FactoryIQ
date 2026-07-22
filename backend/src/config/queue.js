const EventEmitter = require('events');
const documentIntelligenceAgent = require('../agents/DocumentIntelligenceAgent');
const Document = require('../models/Document');
const logger = require('../utils/logger');
const socketUtils = require('../utils/socket');

class AsyncTaskQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.isProcessing = false;

    this.on('job:added', () => {
      this.processNext();
    });
  }

  /**
   * Add a task to the in-process queue
   * @param {string} name - Job type/name
   * @param {object} data - Job data payload
   */
  async add(name, data) {
    this.queue.push({
      name,
      data,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    });
    logger.info(`[TaskQueue] Job queued: ${name} (Queue depth: ${this.queue.length})`);
    setImmediate(() => this.emit('job:added'));
  }

  /**
   * Process queue items in the background
   */
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const job = this.queue.shift();

    setImmediate(async () => {
      try {
        if (job.name === 'process-document') {
          await this.executeDocumentJob(job.data);
        } else {
          logger.warn(`[TaskQueue] Unknown job type: ${job.name}`);
        }
      } catch (err) {
        logger.error(`[TaskQueue] Error executing job ${job.id} (${job.name}): ${err.message}`);
      } finally {
        this.isProcessing = false;
        if (this.queue.length > 0) {
          setImmediate(() => this.processNext());
        }
      }
    });
  }

  /**
   * Execute Document AI extraction, embedding generation & Knowledge Node creation
   */
  async executeDocumentJob(data) {
    const { documentId } = data;
    logger.info(`[TaskQueue] Starting document processing for ID: ${documentId}`);

    const document = await Document.findById(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    document.processingStatus = 'PROCESSING';
    await document.save();
    socketUtils.sendNotification('document:status', { documentId: document._id, status: 'PROCESSING' });

    try {
      await documentIntelligenceAgent.processDocument(document);

      document.processingStatus = 'COMPLETED';
      await document.save();

      logger.info(`[TaskQueue] Document processing completed successfully for ID: ${documentId}`);
      this.emit('job:completed', { name: 'process-document', documentId });
      socketUtils.sendNotification('document:status', { documentId: document._id, status: 'COMPLETED' });
    } catch (err) {
      logger.error(`[TaskQueue] Document processing failed for ID: ${documentId} - ${err.message}`);
      try {
        const failedDoc = await Document.findById(documentId);
        if (failedDoc) {
          failedDoc.processingStatus = 'FAILED';
          await failedDoc.save();
          socketUtils.sendNotification('document:status', {
            documentId: failedDoc._id,
            status: 'FAILED',
            error: err.message
          });
        }
      } catch (saveErr) {
        logger.error(`[TaskQueue] Failed to update document status to FAILED: ${saveErr.message}`);
      }
      this.emit('job:failed', { name: 'process-document', documentId, error: err });
    }
  }
}

const documentQueue = new AsyncTaskQueue();

module.exports = {
  documentQueue
};
