const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const petRoutes = require('./routes/pet.routes');
const notificationRoutes = require('./routes/notification.routes');
const veterinarianRoutes = require('./routes/veterinarian');
const addressRoutes = require('./routes/address.routes');

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/addresses', addressRoutes);

// Database connection and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (in development)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer(); 