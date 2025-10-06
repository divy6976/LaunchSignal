const Feedback=require("../model/feedbackModel")

const submitFeedback = async (req, res) => {
    try {
        const { startupId, comment } = req.body;
        const userId = req.user.userId; // Adopter ki ID

        if (!startupId || !comment) {
            return res.status(400).json({ message: 'Startup ID and comment are required' });
        }

        const newFeedback = await Feedback.create({
            startupId,
            userId,
            comment
        });

        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { submitFeedback };