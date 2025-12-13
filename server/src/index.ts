import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './db/connection';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { isAuthenticated } from './middleware/auth';

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import subjectRoutes from './routes/subjectRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import testRoutes from './routes/testRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to EduDash API',
        version: '1.0.0',
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', isAuthenticated, courseRoutes)
app.use('/api/subjects', isAuthenticated, subjectRoutes)
app.use('/api/tests', isAuthenticated, testRoutes)
app.use('/api/assignments', isAuthenticated, assignmentRoutes)
app.use('/api/attendance', isAuthenticated, attendanceRoutes)
app.use('/api/users', isAuthenticated, userRoutes)

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);

    await testConnection();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
