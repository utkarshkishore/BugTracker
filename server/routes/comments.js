const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const User = require('../models/User'); // Import User to populate name

// @route   GET api/comments/:ticketId
// @desc    Get all comments for a ticket
router.get('/:ticketId', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate('user', 'name') // Replace user ID with user Name
      .sort({ createdAt: 1 }); // Oldest first
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/comments/:ticketId
// @desc    Add a comment
router.post('/:ticketId', auth, async (req, res) => {
  try {
    const newComment = new Comment({
      text: req.body.text,
      ticket: req.params.ticketId,
      user: req.user.id
    });
    const comment = await newComment.save();
    
    // Populate user details immediately so frontend can display name
    await comment.populate('user', 'name'); 
    
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;