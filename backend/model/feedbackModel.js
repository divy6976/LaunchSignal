const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    // Kis startup ke liye feedback hai
    startupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup', // 'Startup' model se link
        required: true
    },
    // Kis user (adopter) ne feedback diya hai
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' model se link
        required: true
    },
    // Asli feedback comment
    comment: {
        type: String,
        required: [true, "Feedback comment cannot be empty"],
        minlength: [10, "Feedback must be at least 10 characters long"]
    }
}, { timestamps: true }); // Taki pata chale feedback kab create/update hua

module.exports = mongoose.model('Feedback', feedbackSchema);