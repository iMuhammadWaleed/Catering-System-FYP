const mongoose = require('mongoose');
const colors = require('colors');

// Database connection configuration
const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferCommands: false, // Disable mongoose buffering

    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB'.yellow);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination'.red);
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`.red.bold);
    
    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

// Database health check
const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return {
      status: states[state] || 'unknown',
      isHealthy: state === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length
    };
  } catch (error) {
    return {
      status: 'error',
      isHealthy: false,
      error: error.message
    };
  }
};

// Retry connection with exponential backoff
const connectWithRetry = async (maxRetries = 5, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectDB();
      return;
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed: ${error.message}`.red);
      
      if (attempt === maxRetries) {
        console.error('Max connection attempts reached. Exiting...'.red.bold);
        process.exit(1);
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms...`.yellow);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = {
  connectDB,
  connectWithRetry,
  checkDatabaseHealth
};

