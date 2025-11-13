const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (important for Render)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MERN Deployment API',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));

// Database connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  try {
    console.log('🔄 Attempting MongoDB connection...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(`   Error: ${error.message}`);
    
    if (retries > 0) {
      console.log(`   Retrying in ${delay/1000} seconds... (${retries} retries left)`);
      setTimeout(() => connectWithRetry(retries - 1, delay), delay);
    } else {
      console.log('💡 Troubleshooting tips:');
      console.log('   1. Check MongoDB Atlas Network Access - add IP 0.0.0.0/0');
      console.log('   2. Verify MONGODB_URI in environment variables');
      console.log('   3. Check database username/password');
      console.log('   4. Ensure database user has correct permissions');
      
      // Don't exit process - let the server run without DB
      console.log('   ⚠️  Server starting without database connection');
    }
  }
};

// Database event listeners
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 URL: http://0.0.0.0:${PORT}`);
  
  // Connect to database
  connectWithRetry();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;