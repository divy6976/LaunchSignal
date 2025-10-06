
const User = require('../model/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const signup = async (req, res) => {
    try {
        // Step 1: User se data lo
        const { fullName, email, password, role } = req.body;

        // Step 2: Validation
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Step 3: User exists check
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Step 4: Naya user banao
        const newUser = await User.create({
            fullName,
            email,
            password,
            role
        });

        // Step 5: Token generate karo
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '3d' }
        );
        
        // --- CHANGE START ---
        // Step 6: Token ko HTTP-Only cookie mein set karo
        const options = {
            httpOnly: true,
            secure: true, // cross-site cookie requires Secure
            sameSite: 'none', // allow cross-site cookie from Vercel → Render
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 din
        };

        res.status(201)
           .cookie('token', token, options)
           .json({
                message: "User created successfully",
                userId: newUser._id,
                fullName: newUser.fullName,
                role: newUser.role
           });
        // --- CHANGE END ---

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const login = async (req, res) => {
    try {
        // ... (validation aur user check aage tak same hai) ...
        let { email, password } = req.body;
        if (email) email = String(email).toLowerCase().trim();
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password" });
        }
        // Find user by email (case-insensitive to support legacy records)
        let user = await User.findOne({ email });
        if (!user) {
            const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            user = await User.findOne({ email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } });
        }
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Step 7: Token generate karo
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '3d' }
        );

        // --- CHANGE START ---
        // Step 8: Token ko HTTP-Only cookie mein set karo
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 din
        };

        res.status(200)
           .cookie('token', token, options)
           .json({
                message: "Logged in successfully",
                userId: user._id,
                fullName: user.fullName,
                role: user.role
           });
        // --- CHANGE END ---
           
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const logoutUser = (req, res) => {
    // --- CHANGE START ---
    // Cookie ko clear karne ka sahi tareeka
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0) // Cookie ko expire kar do
    });
    res.status(200).json({ message: 'Logged out successfully' });
    // --- CHANGE END ---
};

module.exports = { signup, login, getProfile, logoutUser };
// Google OAuth login controller
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'Missing Google credential' });
        }

        // Verify credential with Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = String(payload.email || '').toLowerCase().trim();
        const fullName = payload.name || payload.given_name || 'User';

        if (!email) {
            return res.status(400).json({ message: 'Google account missing email' });
        }

        // Find user. Do NOT auto-create; ask user to sign up first.
        const adminEmail = 'divyprakashpandey6@gmail.com';
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'Account not found. Please sign up first.',
                needsSignup: true,
                email,
            });
        }
        if (email === adminEmail && user.role !== 'founder') {
            // Ensure admin email has founder role
            user.role = 'founder';
            await user.save();
        }

        // Issue our JWT in httpOnly cookie
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '3d' }
        );
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000,
        };

        res
          .cookie('token', token, options)
          .status(200)
          .json({ message: 'Logged in successfully', userId: user._id, fullName: user.fullName, role: user.role, email: user.email });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

module.exports.googleLogin = googleLogin;