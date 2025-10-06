// Here's your updated app.js with CORS added:

require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ADD THIS LINE
const {connectDB} = require('../config/database.js');
const authRoutes = require('../routes/userRoutes.js');
const cookieParser = require('cookie-parser');
const startupRoutes=require('../routes/startupRoutes.js')
// const feedbackRoutes=require('../routes/feedbackRoutes.js')

const app = express()
const port = 3000

// ADD CORS CONFIGURATION HERE
app.use(cors({
    origin: ['http://localhost:8081', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', authRoutes); // User waale saare routes yahan se handle honge
app.use('/api/startups', startupRoutes); // Startup waale saare routes yahan se
// app.use('/api/feedback', feedbackRoutes); // Feedback waale saare routes yahan se

// Debug route to check if server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date() });
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Failed to connect to the database", err);
});
