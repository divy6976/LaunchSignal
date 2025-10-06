const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['founder', 'adopter']
    },
    interests: {
        type: [String],
        default: []
    },
    upvotedStartups: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Startup',
        default: []
    }
}, { timestamps: true });

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Export the model
module.exports = mongoose.model('User', userSchema);