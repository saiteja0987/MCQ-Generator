const express = require('express');
const router = express.Router();
const mcqController = require('../controllers/mcqController');

// POST /api/generate-mcq
router.post('/generate-mcq', mcqController.generateMCQ);

// POST /api/generate-questions (unified endpoint for MCQ and subjective)
router.post('/generate-questions', mcqController.generateQuestions);

module.exports = router;