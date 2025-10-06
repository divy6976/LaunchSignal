const express = require('express');
const { sendContactEmail } = require('../controller/contactController');

const router = express.Router();

// Contact form submission
router.post('/contact', sendContactEmail);

module.exports = router;
