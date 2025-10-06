const express = require('express');
const { createStartup, getFeedForAdopter, getStartupsForFounder, getFeedbackForStartup, getStartupById, updateStartup, upvoteStartup, removeUpvote, getMyUpvotes, setStartupStatus, listAllStartupsAdmin, getFounderAnalytics, getTrendingPublic, getFilterOptions, incrementView, getStartupAnalytics, getAdminCounts } = require('../controller/startupController');
const { isLoggedIn, isFounder, isAdopter, attachUserIfPresent } = require('../middleware/auth');
const router = express.Router();

// Simple admin check middleware (email allowlist) — replace with proper role later
const isAdmin = (req, res, next) => {
    const adminEmails = ['divyprakashpandey6@gmail.com'];
    // req.user set by isLoggedIn
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    // We'll need the email on req.user; fallback to query/header if not present
    const email = req.user.email || req.headers['x-user-email'];
    if (email && adminEmails.includes(String(email).toLowerCase())) return next();
    return res.status(403).json({ message: 'Forbidden' });
}


// Test route (no auth required)
router.get('/test', (req, res) => {
    res.json({ message: 'Startup routes working!' });
});

// Test POST route (no auth required) - for testing
router.post('/test', (req, res) => {
    res.json({ 
        message: 'POST route working!', 
        body: req.body,
        received: true 
    });
}); 

// Simple route without auth for testing

// Founder apne startups dekh sakta hai (fetch from DB)
router.get('/my-startups', isLoggedIn, isFounder, getStartupsForFounder);
// Sirf logged-in founder hi startup create kar sakta hai
router.post('/', isLoggedIn, isFounder, createStartup);
// Sirf logged-in founder hi startup update kar sakta hai
router.put('/:startupId', isLoggedIn, isFounder, updateStartup);
// Adopter/public feed: attach user if present so controller can personalize
router.get('/', attachUserIfPresent, getFeedForAdopter);

// Founder analytics
router.get('/founder/analytics', isLoggedIn, isFounder, getFounderAnalytics);

// Public trending
router.get('/trending', getTrendingPublic);

// Get filter options for dropdowns
router.get('/filter-options', getFilterOptions);

// Increment view count for a startup
router.post('/:id/view', incrementView);

// Adopter upvotes persistence
router.post('/:id/upvote', isLoggedIn, isAdopter, upvoteStartup);
router.delete('/:id/upvote', isLoggedIn, isAdopter, removeUpvote);
router.get('/my-upvotes/list', isLoggedIn, isAdopter, getMyUpvotes);

// Admin-only: set status
router.patch('/:id/status', isLoggedIn, isAdmin, setStartupStatus);

// Admin-only: list all startups with filters
router.get('/admin/list', isLoggedIn, isAdmin, listAllStartupsAdmin);

// Admin-only: counts for dashboard
router.get('/admin/counts', isLoggedIn, isAdmin, getAdminCounts);

// Debug route to check if GET / is working
router.get('/debug', (req, res) => {
    res.json({ message: 'GET /debug route working!' });
});

// Ek startup ke saare feedback dekhne ke liye
router.get('/:startupId/feedback', isLoggedIn, isFounder, getFeedbackForStartup);

// Get detailed analytics for a specific startup
router.get('/:startupId/analytics', isLoggedIn, isFounder, getStartupAnalytics);

// Public/adopter: get startup by id
router.get('/:id', getStartupById);

module.exports = router;
