require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ADD THIS LINE
const {connectDB} = require('../config/database.js');
const User = require('../model/usermodel');
const bcrypt = require('bcryptjs');
const authRoutes = require('../routes/userRoutes.js');
const cookieParser = require('cookie-parser');
const startupRoutes=require('../routes/startupRoutes.js')
const { getStartupsForFounder } = require('../controller/startupController');
const feedbackRoutes=require('../routes/feedbackRoutes.js')
const contactRoutes = require('../routes/contactRoutes.js');

const app = express()
const port = Number(process.env.PORT) || 3000

// CORS: allow local dev and optional VERCEL_URL origin via env
app.use((req, res, next) => {
    const origin = req.headers.origin || '';
    const vercelUrl = process.env.FRONTEND_ORIGIN || '';
    const allowed = ['http://localhost:8080', 'http://127.0.0.1:8080'];
    if (vercelUrl) allowed.push(vercelUrl);
    if (allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type, Authorization, Cookie, Accept, Origin, X-Requested-With');
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
});

// Express v5: '*' path patterns are invalid. Preflight handled above in middleware.

// Remove package-based cors to avoid overrides; manual headers above handle CORS

// Increase body size limits to allow small base64 images from the frontend
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// Routes
// Debug logger for only /api/startups traffic
app.use('/api/startups', (req, res, next) => {
    console.log(`[startups] ${req.method} ${req.originalUrl}`);
    next();
});

// Minimal inline handler to verify route resolution. Swap back after confirming.
// app.get('/api/startups/my-startups', (req, res) => {
//     return res.status(200).json({ message: 'OK', startups: [], count: 0 });
// });
app.use('/api/users', authRoutes); // User waale saare routes yahan se handle honge
app.use('/api/startups', startupRoutes); // Startup waale saare routes yahan se
app.use('/api/feedback', feedbackRoutes); // Feedback waale saare routes yahan se
app.use('/api', contactRoutes); // Contact form routes

app.use('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});
// Debug route to check if server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date() });
});

connectDB().then(() => {
    // Ensure admin user exists in development
    (async () => {
        try {
            const adminEmail = 'divyprakashpandey6@gmail.com';
            const adminPassword = 'divy@6976';
            let admin = await User.findOne({ email: adminEmail });
            if (!admin) {
                const hashed = await bcrypt.hash(adminPassword, 10);
                admin = await User.create({
                    fullName: 'Admin',
                    email: adminEmail,
                    password: hashed,
                    role: 'founder'
                });
                console.log('✅ Seeded admin user:', adminEmail);
            } else {
                // Keep password in sync to avoid 500 on login when mismatched
                const match = await bcrypt.compare(adminPassword, admin.password);
                if (!match) {
                    admin.password = await bcrypt.hash(adminPassword, 10);
                    await admin.save();
                    console.log('🔁 Updated admin password');
                }
            }
        } catch (e) {
            console.warn('Admin ensure failed:', e?.message);
        }
    })();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${port}`);
    });
}).catch(err => {
    console.error("Failed to connect to the database", err);
});