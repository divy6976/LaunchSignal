const mongoose = require('mongoose');

const upvoteSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, { timestamps: true });

upvoteSchema.index({ startupId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Upvote', upvoteSchema);


