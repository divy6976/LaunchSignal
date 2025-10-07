const mongoose = require('mongoose');
const User = require('../model/usermodel');
const Feedback = require('../model/feedbackModel');
const Upvote = require('../model/upvoteModel');

// Create a simple working schema here temporarily
const startupSchema = new mongoose.Schema({
    founderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    tagline: {
        type: String,
        required: true,
        minlength: 10,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 50
    },
    industry: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: true
    },
    businessType: {
        type: String,
        enum: ["B2B", "B2C"],
        required: true
    },
    targetAudience: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true,
        match: [/^https?:\/\/.+/, "Please enter a valid URL"]
    },
    // Optional media storage (base64 for quick MVP)
    logo: {
        type: String, // data URL/base64
        default: null
    },
    media: {
        type: [String], // array of data URL/base64
        default: []
    },
    // Optional special offer fields for early adopters
    hasSpecialOffer: {
        type: Boolean,
        default: false
    },
    specialOfferText: {
        type: String,
        default: ''
    },
    specialOfferCode: {
        type: String,
        default: null
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Audience metric for views
    views: {
        type: Number,
        default: 0,
        min: 0,
    },
    // Analytics tracking
    analytics: {
        dailyViews: [{
            date: { type: Date, default: Date.now },
            count: { type: Number, default: 0 }
        }],
        hourlyViews: [{
            hour: { type: Number, min: 0, max: 23 },
            count: { type: Number, default: 0 }
        }],
        demographics: {
            ageGroups: [{
                range: String,
                percentage: Number
            }],
            trafficSources: [{
                source: String,
                percentage: Number
            }]
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

const Startup = mongoose.model('Startup', startupSchema);

const createStartup = async (req, res) => {
    try {
        // Check if user is authenticated
        const founderId = req.user ? req.user.userId : new mongoose.Types.ObjectId();
        const startupData = req.body;

        // Basic server-side caps for media arrays
        if (Array.isArray(startupData.media)) {
            startupData.media = startupData.media.slice(0, 5);
        }

        // Normalize legacy form fields to new schema
        const normalizedOffer = {
            hasSpecialOffer: Boolean(
                startupData.hasSpecialOffer ||
                startupData.specialOffer ||
                startupData.specialOfferText ||
                startupData.couponCode ||
                (typeof startupData.discount === 'number' && startupData.discount > 0)
            ),
            specialOfferText: startupData.specialOfferText || startupData.specialOffer || '',
            specialOfferCode: startupData.specialOfferCode || startupData.couponCode || null,
            discount: typeof startupData.discount === 'number' ? startupData.discount : 0,
        };

        const newStartup = await Startup.create({
            ...startupData,
            ...normalizedOffer,
            founderId: founderId
        });

        res.status(201).json({
            message: 'Startup created successfully',
            startup: newStartup
        });
    } catch (error) {
        console.error('Startup creation error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getFeedForAdopter = async (req, res) => {
    try {
        // If user context not present (e.g., local/dev), return all startups
        if (!req.user || !req.user.userId) {
            const allStartups = await Startup.find({})
                .populate('founderId', 'fullName')
                .sort({ createdAt: -1 });
            
            // Add upvote counts for each startup
            const startupsWithUpvotes = await Promise.all(
                allStartups.map(async (startup) => {
                    const upvoteCount = await Upvote.countDocuments({ startupId: startup._id });
                    return {
                        ...startup.toObject(),
                        upvotes: upvoteCount
                    };
                })
            );
            
            return res.status(200).json(startupsWithUpvotes);
        }

        // Logged-in adopter
        const userId = req.user.userId;
        const adopter = await User.findById(userId);
        const upvotedIds = Array.isArray(adopter?.upvotedStartups) ? adopter.upvotedStartups : [];

        // If no interests set, return all startups instead of empty list
        if (!adopter || !Array.isArray(adopter.interests) || adopter.interests.length === 0) {
            const allStartups = await Startup.find({
                _id: { $nin: upvotedIds }
            })
                .populate('founderId', 'fullName')
                .sort({ createdAt: -1 });
            
            // Add upvote counts for each startup
            const startupsWithUpvotes = await Promise.all(
                allStartups.map(async (startup) => {
                    const upvoteCount = await Upvote.countDocuments({ startupId: startup._id });
                    return {
                        ...startup.toObject(),
                        upvotes: upvoteCount
                    };
                })
            );
            
            return res.status(200).json(startupsWithUpvotes);
        }

        // Filter by adopter interests and exclude already upvoted
        const startups = await Startup.find({
            categories: { $in: adopter.interests },
            _id: { $nin: upvotedIds }
        })
            .populate('founderId', 'fullName')
            .sort({ createdAt: -1 });

        // Add upvote counts for each startup
        const startupsWithUpvotes = await Promise.all(
            startups.map(async (startup) => {
                const upvoteCount = await Upvote.countDocuments({ startupId: startup._id });
                return {
                    ...startup.toObject(),
                    upvotes: upvoteCount
                };
            })
        );

        res.status(200).json(startupsWithUpvotes);
    } catch (error) {
        console.error('Error building adopter feed:', error);
        // Fallback to safe empty list to avoid breaking the UI
        try {
            const allStartups = await Startup.find({}).sort({ createdAt: -1 });
            return res.status(200).json(allStartups);
        } catch (e) {
            return res.status(200).json([]);
        }
    }
};



const getStartupsForFounder = async (req, res) => {
    try {
        const founderId = req.user?.userId;
        if (!founderId) {
            // In local/dev without auth, gracefully return empty list
            return res.status(200).json({
                message: 'Startups retrieved successfully',
                startups: [],
                count: 0
            });
        }
        
        const startups = await Startup.find({ founderId: founderId })
            .populate('founderId', 'fullName')
            .sort({ createdAt: -1 }); // Latest first

        res.status(200).json({
            message: 'Startups retrieved successfully',
            startups: startups,
            count: startups.length
        });
    } catch (error) {
        console.error('Error fetching founder startups:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getFeedbackForStartup = async (req, res) => {
    try {
        const { startupId } = req.params;

        // Security Check: Ensure karna ki jo founder request kar raha hai, woh is startup ka owner hai
        // (Yeh logic aap ek alag middleware 'isOwner' mein bhi daal sakte hain)
        const startup = await Startup.findById(startupId);
        if (startup.founderId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to view this feedback' });
        }

        const feedbacks = await Feedback.find({ startupId: startupId }).populate('userId', 'fullName');

        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get single startup by ID (public/adopter view)
const getStartupById = async (req, res) => {
    try {
        const { id } = req.params;
        const startup = await Startup.findById(id).populate('founderId', 'fullName');
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        // Only expose approved startups to public/adopters
        if (startup.status !== 'approved') {
            return res.status(403).json({ message: 'This startup is not available' });
        }
        res.status(200).json(startup);
    } catch (error) {
        console.error('Error fetching startup by id:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Persist upvote for adopter
const upvoteStartup = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });

        const startup = await Startup.findById(id);
        if (!startup) return res.status(404).json({ message: 'Startup not found' });

        const user = await User.findById(userId);
        const exists = user.upvotedStartups.some(s => String(s) === String(id));
        if (!exists) {
            user.upvotedStartups.push(id);
            await user.save();
            // also record a timestamped upvote for analytics
            try { await Upvote.create({ startupId: id, userId }); } catch (_) {}
        }
        res.status(200).json({ message: 'Upvoted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Remove upvote
const removeUpvote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const user = await User.findById(userId);
        user.upvotedStartups = user.upvotedStartups.filter(s => String(s) !== String(id));
        await user.save();
        try { await Upvote.deleteOne({ startupId: id, userId }); } catch (_) {}
        res.status(200).json({ message: 'Removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get adopter's upvoted startups (with upvote counts)
const getMyUpvotes = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const user = await User.findById(userId).populate('upvotedStartups');
        const startups = Array.isArray(user?.upvotedStartups) ? user.upvotedStartups : [];
        const startupsWithCounts = await Promise.all(
            startups.map(async (startupDoc) => {
                const upvoteCount = await Upvote.countDocuments({ startupId: startupDoc._id });
                const obj = typeof startupDoc.toObject === 'function' ? startupDoc.toObject() : startupDoc;
                return { ...obj, upvotes: upvoteCount };
            })
        );
        res.status(200).json({ startups: startupsWithCounts });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update startup (founder only)
const updateStartup = async (req, res) => {
    try {
        const { startupId } = req.params;
        const founderId = req.user?.userId;
        
        if (!founderId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check if startup exists and belongs to the founder
        const existingStartup = await Startup.findById(startupId);
        if (!existingStartup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        if (existingStartup.founderId.toString() !== founderId) {
            return res.status(403).json({ message: 'Not authorized to update this startup' });
        }

        const startupData = req.body;

        // Basic server-side caps for media arrays
        if (Array.isArray(startupData.media)) {
            startupData.media = startupData.media.slice(0, 5);
        }

        // Normalize legacy form fields to new schema
        const normalizedOffer = {
            hasSpecialOffer: Boolean(
                startupData.hasSpecialOffer ||
                startupData.specialOffer ||
                startupData.specialOfferText ||
                startupData.couponCode ||
                (typeof startupData.discount === 'number' && startupData.discount > 0)
            ),
            specialOfferText: startupData.specialOfferText || startupData.specialOffer || '',
            specialOfferCode: startupData.specialOfferCode || startupData.couponCode || null,
            discount: typeof startupData.discount === 'number' ? startupData.discount : 0,
        };

        const updatedStartup = await Startup.findByIdAndUpdate(
            startupId,
            {
                ...startupData,
                ...normalizedOffer,
                founderId: founderId // Ensure founderId doesn't change
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Startup updated successfully',
            startup: updatedStartup
        });
    } catch (error) {
        console.error('Startup update error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Admin actions: approve or reject a startup
const setStartupStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' | 'rejected'
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const updated = await Startup.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Startup not found' });
        res.status(200).json({ message: 'Status updated', startup: updated });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Admin: list startups with optional status filter and search
const listAllStartupsAdmin = async (req, res) => {
    try {
        const { status, q } = req.query;
        const filter = {};
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            filter.status = status;
        }
        if (q) {
            const rx = new RegExp(q, 'i');
            filter.$or = [{ name: rx }, { tagline: rx }];
        }
        const startups = await Startup.find(filter)
            .populate('founderId', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(200).json({ startups });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Public: trending startups by upvotes
const getTrendingPublic = async (req, res) => {
    try {
        const { window } = req.query; // 'week' | 'all'
        const match = {};
        if (window !== 'all') {
            const since = new Date();
            since.setDate(since.getDate() - 7);
            match.createdAt = { $gte: since };
        }
        const upvoteAgg = await Upvote.aggregate([
            { $match: match },
            { $group: { _id: '$startupId', upvotes: { $sum: 1 } } },
            { $sort: { upvotes: -1 } },
            { $limit: 20 },
        ]);
        const ids = upvoteAgg.map(u => u._id);
        const startups = await Startup.find({ _id: { $in: ids } }).lean();
        const upvoteMap = new Map(upvoteAgg.map(u => [String(u._id), u.upvotes]));
        const items = startups.map(s => ({
            id: s._id,
            name: s.name,
            tagline: s.tagline,
            description: s.description,
            industry: s.industry,
            categories: s.categories,
            businessType: s.businessType,
            views: s.views || 0,
            upvotes: upvoteMap.get(String(s._id)) || 0,
            founderId: s.founderId,
            logo: s.logo || null,
            hasSpecialOffer: Boolean(s.hasSpecialOffer),
            specialOfferText: s.specialOfferText || '',
            specialOfferCode: s.specialOfferCode || null,
            discount: typeof s.discount === 'number' ? s.discount : 0,
        })).sort((a, b) => b.upvotes - a.upvotes);
        return res.status(200).json({ startups: items });
    } catch (error) {
        console.error('Trending public error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message, startups: [] });
    }
};
// Founder analytics: views, feedbacks, matches(upvotes), weekly trending (top by upvotes in last 7 days)
const getFounderAnalytics = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });

        const startups = await Startup.find({ founderId: userId });
        const startupIds = startups.map(s => s._id);

        const totalViews = startups.reduce((sum, s) => sum + (s.views || 0), 0);
        const feedbacksCount = await Feedback.countDocuments({ startupId: { $in: startupIds } });

        const matchesAgg = await Upvote.aggregate([
            { $match: { startupId: { $in: startupIds } } },
            { $count: 'total' }
        ]);
        const matches = matchesAgg?.[0]?.total || 0;
        const feedbackRate = totalViews > 0 ? Math.round((feedbacksCount / totalViews) * 100) : 0;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const trendingAgg = await Upvote.aggregate([
            { $match: { createdAt: { $gte: oneWeekAgo } } },
            { $group: { _id: '$startupId', upvotes: { $sum: 1 } } },
            { $sort: { upvotes: -1 } },
            { $limit: 5 },
        ]);
        const trendingIds = trendingAgg.map(t => t._id);
        const trendingDocs = await Startup.find({ _id: { $in: trendingIds } }).lean();
        const upvoteMap = new Map(trendingAgg.map(t => [String(t._id), t.upvotes]));
        const trending = trendingDocs.map(s => ({
            id: s._id,
            name: s.name,
            tagline: s.tagline,
            upvotes: upvoteMap.get(String(s._id)) || 0,
            views: s.views || 0,
            industry: s.industry,
        })).sort((a, b) => b.upvotes - a.upvotes);

        return res.status(200).json({
            stats: { views: totalViews, feedbacks: feedbacksCount, matches, feedbackRate },
            trending,
            count: startups.length,
        });
    } catch (error) {
        console.error('Founder analytics error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get unique categories and industries for filter dropdowns
const getFilterOptions = async (req, res) => {
    try {
        // Get unique categories (flatten the arrays since categories is an array field)
        const categoriesResult = await Startup.aggregate([
            { $unwind: '$categories' },
            { $group: { _id: '$categories' } },
            { $sort: { _id: 1 } }
        ]);
        const categories = categoriesResult.map(cat => cat._id);

        // Get unique industries
        const industriesResult = await Startup.aggregate([
            { $group: { _id: '$industry' } },
            { $sort: { _id: 1 } }
        ]);
        const industries = industriesResult.map(ind => ind._id);

        res.status(200).json({
            categories: categories.filter(cat => cat && cat.trim() !== ''),
            industries: industries.filter(ind => ind && ind.trim() !== '')
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Increment view count for a startup
const incrementView = async (req, res) => {
    try {
        const { id } = req.params;
        
        const startup = await Startup.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        
        res.status(200).json({ 
            message: 'View incremented',
            views: startup.views 
        });
    } catch (error) {
        console.error('Error incrementing view:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get detailed analytics for a specific startup
const getStartupAnalytics = async (req, res) => {
    try {
        const { startupId } = req.params;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check if startup exists and belongs to the founder
        const startup = await Startup.findById(startupId);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        if (startup.founderId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to view analytics for this startup' });
        }

        // Get upvotes for this startup
        const upvotes = await Upvote.find({ startupId }).sort({ createdAt: -1 });
        const upvoteCount = upvotes.length;

        // Get feedback for this startup
        const feedbacks = await Feedback.find({ startupId }).populate('userId', 'fullName').sort({ createdAt: -1 });
        const feedbackCount = feedbacks.length;

        // Generate daily analytics data (last 30 days)
        const dailyData = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Count views for this date (mock data for now)
            const dailyViews = Math.floor(Math.random() * 50) + 10;
            
            // Count upvotes for this date
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dailyUpvotes = await Upvote.countDocuments({
                startupId,
                createdAt: { $gte: dayStart, $lte: dayEnd }
            });

            // Count feedback for this date
            const dailyFeedback = await Feedback.countDocuments({
                startupId,
                createdAt: { $gte: dayStart, $lte: dayEnd }
            });

            dailyData.push({
                date: dateStr,
                views: dailyViews,
                upvotes: dailyUpvotes,
                feedback: dailyFeedback,
                shares: Math.floor(Math.random() * 5) + 1, // Mock data
            });
        }

        // Generate hourly data for today
        const hourlyData = [];
        for (let hour = 0; hour < 24; hour++) {
            const hourStart = new Date();
            hourStart.setHours(hour, 0, 0, 0);
            const hourEnd = new Date();
            hourEnd.setHours(hour, 59, 59, 999);

            const hourlyViews = Math.floor(Math.random() * 20) + 1; // Mock data
            const hourlyUpvotes = await Upvote.countDocuments({
                startupId,
                createdAt: { $gte: hourStart, $lte: hourEnd }
            });

            hourlyData.push({
                hour: `${hour}:00`,
                views: hourlyViews,
                upvotes: hourlyUpvotes,
            });
        }

        // Mock demographic data
        const demographicData = [
            { name: '18-24', value: 25, color: '#8884d8' },
            { name: '25-34', value: 35, color: '#82ca9d' },
            { name: '35-44', value: 20, color: '#ffc658' },
            { name: '45-54', value: 15, color: '#ff7300' },
            { name: '55+', value: 5, color: '#00ff00' },
        ];

        // Mock traffic sources
        const trafficSources = [
            { name: 'Direct', value: 40, color: '#8884d8' },
            { name: 'Social Media', value: 30, color: '#82ca9d' },
            { name: 'Search', value: 20, color: '#ffc658' },
            { name: 'Referral', value: 10, color: '#ff7300' },
        ];

        // Calculate overview metrics
        const totalViews = dailyData.reduce((sum, day) => sum + day.views, 0);
        const totalUpvotes = upvoteCount;
        const totalFeedback = feedbackCount;
        const totalShares = dailyData.reduce((sum, day) => sum + day.shares, 0);
        const engagementRate = totalViews > 0 ? Math.round((totalUpvotes / totalViews) * 100) : 0;
        const feedbackRate = totalViews > 0 ? Math.round((totalFeedback / totalViews) * 100) : 0;
        const avgViewsPerDay = Math.round(totalViews / 30);
        const growthRate = Math.floor(Math.random() * 50) - 10; // Mock growth rate

        // Top performers
        const topPerformers = [
            { 
                metric: 'Peak View Day', 
                value: Math.max(...dailyData.map(d => d.views)), 
                date: dailyData.find(d => d.views === Math.max(...dailyData.map(d => d.views)))?.date 
            },
            { 
                metric: 'Best Engagement', 
                value: Math.max(...dailyData.map(d => d.upvotes)), 
                date: dailyData.find(d => d.upvotes === Math.max(...dailyData.map(d => d.upvotes)))?.date 
            },
            { 
                metric: 'Most Feedback', 
                value: Math.max(...dailyData.map(d => d.feedback)), 
                date: dailyData.find(d => d.feedback === Math.max(...dailyData.map(d => d.feedback)))?.date 
            },
        ];

        // Recent activity
        const recentActivity = [];
        
        // Add recent upvotes
        upvotes.slice(0, 3).forEach(upvote => {
            recentActivity.push({
                type: 'upvote',
                user: 'Anonymous User', // We don't store user info in upvotes
                time: new Date(upvote.createdAt).toLocaleString(),
                timestamp: upvote.createdAt
            });
        });

        // Add recent feedback
        feedbacks.slice(0, 3).forEach(feedback => {
            recentActivity.push({
                type: 'feedback',
                user: feedback.userId?.fullName || 'Anonymous User',
                time: new Date(feedback.createdAt).toLocaleString(),
                timestamp: feedback.createdAt
            });
        });

        // Sort by timestamp and take first 5
        recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        recentActivity.splice(5);

        const analytics = {
            overview: {
                totalViews,
                totalUpvotes,
                totalFeedback,
                totalShares,
                engagementRate,
                feedbackRate,
                avgViewsPerDay,
                growthRate,
            },
            dailyData,
            hourlyData,
            demographicData,
            trafficSources,
            topPerformers,
            recentActivity
        };

        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching startup analytics:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Admin: basic counts for dashboard
const getAdminCounts = async (req, res) => {
    try {
        const totalStartups = await Startup.countDocuments({});
        const totalUsers = await User.countDocuments({});
        const pending = await Startup.countDocuments({ status: 'pending' });
        const approved = await Startup.countDocuments({ status: 'approved' });
        const rejected = await Startup.countDocuments({ status: 'rejected' });
        return res.status(200).json({ totalStartups, totalUsers, pending, approved, rejected });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Exports mein bhi add karein
module.exports = { createStartup, getFeedForAdopter, getStartupsForFounder, getFeedbackForStartup, getStartupById, updateStartup, upvoteStartup, removeUpvote, getMyUpvotes, setStartupStatus, listAllStartupsAdmin, getFounderAnalytics, getTrendingPublic, getFilterOptions, incrementView, getStartupAnalytics, getAdminCounts }