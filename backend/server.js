require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import route handlers
const loginRoute = require('./api/auth/login');
const registerRoute = require('./api/auth/register');
const uploadRoute = require('./api/pdf/upload');
const aiRoutes = require('./api/ai/gemini');
const userDataRoute = require('./api/user/data');
const deleteRoutes = require('./api/delete');
const historyRoute = require('./api/chat/history');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://cognote-one.vercel.app',
            'https://cognote-qbph.vercel.app', // Added specific deployment
            ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
        ].map(url => url ? url.trim() : null).filter(Boolean);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Remove trailing slash for comparison
        const normalizedOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.some(allowed =>
            allowed && normalizedOrigin === allowed.replace(/\/$/, '')
        );

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`[CORS] Blocked origin: ${origin}`); // Debug log
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CogNote Backend API is running' });
});

// Auth routes
app.post('/api/auth/register', registerRoute);
app.post('/api/auth/login', loginRoute);

// PDF routes
// PDF routes
app.post('/api/pdf/upload', uploadRoute);

// User Data routes
// User Data routes
app.post('/api/user/data', userDataRoute);
app.use('/api/user/settings', require('./api/user/settings'));
app.use('/api/notebooks', require('./api/notebooks'));

// AI routes
app.post('/api/ai/summarize', aiRoutes.summarize);
app.post('/api/ai/flashcards', aiRoutes.flashcards);
app.post('/api/ai/quiz', aiRoutes.quiz);
app.post('/api/ai/chat', aiRoutes.chat);
app.get('/api/chat/history', historyRoute.getHistory);

// Delete routes
app.use('/api/delete', deleteRoutes); // Added usage for deleteRoutes

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 CogNote Backend Server is running!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
    console.log(`📄 PDF endpoints: http://localhost:${PORT}/api/pdf/*`);
    console.log(`🤖 AI endpoints: http://localhost:${PORT}/api/ai/*\n`);
});

module.exports = app;
