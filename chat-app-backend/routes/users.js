const express = require('express');
const User = require('../models/User'); // Your User model
const router = express.Router();

// Endpoint to fetch users
router.get('/', async (req, res) => {
  const { currentUser } = req.query;
  if (!currentUser) {
    return res.status(400).json({ error: 'No current user specified' });
  }

  try {
    const users = await User.find({username :{$ne: currentUser}}, 'username'); // Fetch only usernames
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
  console.log('Query currentUser:', currentUser); // Debugging
  // console.log('Filtered Users:', users); // Debugging
});

module.exports = router;
