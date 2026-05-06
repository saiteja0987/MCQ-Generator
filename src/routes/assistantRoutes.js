const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

// AI Study Assistant routes
router.post('/assistant-chat', assistantController.assistantChat);
router.post('/assistant-generate', assistantController.assistantGenerate);

module.exports = router;
