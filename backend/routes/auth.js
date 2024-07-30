const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const verifyToken = require('../middlewares/auth');

// Utility functions
const validateEmail = (email) => {
  const eduDomainRegex = /^[^\s@]+@[^\s@]+\.com$/;
  return eduDomainRegex.test(email);
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

// POST route for user signup
router.post('/signup', async (req, res) => {
  console.log('Received signup request');
  const { email, password, name } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email domain. Please use a .edu email.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    // Save user with verificationCode
    await User.create({ email, password: hashedPassword, name, verificationCode });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Signup successful. Verification code sent to your email.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST route for email verification
router.post('/verify', async (req, res) => {
  console.log('Received verify request');

  const { email, code } = req.body;

  try {
    const user = await User.findOne({ where: { email, verificationCode: code } });
    if (!user) {
      return res.status(404).json({ error: 'Invalid verification code.' });
    }

    user.verificationCode = null;
    user.emailVerified = true;
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Failed to verify email.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user.id });
    console.log(user.id);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


   
