const knowledgeAgent = require('../agents/KnowledgeAgent');
// Consider creating a ChatHistory model later if persistence is needed

// @desc    Ask a question to the AI Agent
// @route   POST /api/chat
// @access  Private
exports.askQuestion = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return next(new Error('Message is required'));
    }

    const userRole = req.user ? req.user.role : 'ENGINEER';
    const response = await knowledgeAgent.query(message, userRole);

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
};
