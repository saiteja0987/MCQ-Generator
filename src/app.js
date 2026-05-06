const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./server');

const PORT = process.env.PORT || 3000;

// Global error handlers to avoid crashes from unhandled rejections/exceptions
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📋 Frontend available at http://localhost:${PORT}`);
});
