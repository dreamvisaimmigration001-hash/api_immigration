import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import visaRoutes from './routes/visaRoutes.js';

// Validate required environment variables on startup
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'ALLOWED_ORIGINS'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: Environment variable ${envVar} is not set.`);
    process.exit(1);
  }
}

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
app.use(cors({
  credentials: true, // often needed if using cookies
}));

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit payload size to prevent DoS
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visas', visaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
