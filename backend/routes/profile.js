const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifyToken = require('../middlewares/auth');

// GET user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user profile
router.put('/', verifyToken, async (req, res) => {
  const { name, email, bio, profilePicture } = req.body;

  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user profile
    user.name = name;
    user.email = email;
    user.bio = bio;
    user.profilePicture = profilePicture;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
