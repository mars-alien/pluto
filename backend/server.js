require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dashboardRoutes = require('./routes/dashboard'); 
const performanceRoutes = require('./routes/performance');
const wishlistRoutes = require('./routes/wishlistRoutes');

const authRoutes = require('./routes/auth');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/wishlist', wishlistRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running ' });
});


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
