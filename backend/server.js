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

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
app.post('/api/user/data', userDataRoute);

// AI routes
app.post('/api/ai/summarize', aiRoutes.summarize);
app.post('/api/ai/flashcards', aiRoutes.flashcards);
app.post('/api/ai/quiz', aiRoutes.quiz);
app.post('/api/ai/chat', aiRoutes.chat);

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
