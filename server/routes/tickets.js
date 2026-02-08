const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ticket = require('../models/Ticket');

// @route   POST api/tickets
// @desc    Create a ticket
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, projectId, priority, status } = req.body;
    
    const newTicket = new Ticket({
      title,
      description,
      project: projectId,
      priority,
      status
    });

    const ticket = await newTicket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tickets/project/:projectId
// @desc    Get all tickets for a specific project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ project: req.params.projectId });
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tickets/:id
// @desc    Delete a ticket
router.delete('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    await ticket.deleteOne();
    res.json({ msg: 'Ticket removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tickets/:id
// @desc    Update ticket status (drag and drop)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    
    // Find ticket by ID
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    // Update fields if they are provided in the request
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority;
    if (status) ticket.status = status;

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;