
const express = require('express');
const cors = require('cors');
const path = require('path');
const mcqRoutes = require('./routes/mcqRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow Cross-Origin requests
app.use(express.json()); // Parse JSON bodies

// Static Files (Serve the frontend directly)
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', mcqRoutes);
app.use('/api', assistantRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'active', message: 'Node.js MCQ Backend is running' });
});

module.exports = app;