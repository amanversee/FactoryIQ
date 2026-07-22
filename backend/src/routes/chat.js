const express = require('express');
const { askQuestion } = require('../controllers/chat');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, askQuestion);

module.exports = router;
