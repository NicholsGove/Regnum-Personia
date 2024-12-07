const { sendEmail } = require('../utils/emailService');

exports.contact = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await sendEmail('support@regnumpecuniae.com', 'Contact Form Submission', `${name} (${email}) says: ${message}`);
        res.send('Message sent successfully.');
    } catch (error) {
        res.status(500).send('Error sending message.');
    }
};
