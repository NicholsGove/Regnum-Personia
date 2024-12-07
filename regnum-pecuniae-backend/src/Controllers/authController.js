const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        await User.create(email, hashedPassword, verificationCode);
        await sendEmail(email, 'Verify Your Email', `Your code is: ${verificationCode}`);
        res.status(201).send('User registered. Check your email for verification code.');
    } catch (error) {
        res.status(400).send('Error registering user.');
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    const user = await User.findByEmail(email);
    if (user && user.verification_code === code) {
        await User.verifyEmail(email);
        res.send('Email verified.');
    } else {
        res.status(400).send('Invalid code.');
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (user) {
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await User.updateResetToken(email, resetToken);
        await sendEmail(email, 'Reset Password', `Reset link: http://localhost:5000/auth/reset?token=${resetToken}`);
        res.send('Reset email sent.');
    } else {
        res.status(404).send('User not found.');
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, decoded.email]);
        res.send('Password reset successfully.');
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};
