
const express = require('express');
const Task = require('../models/Task');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin' || req.user.role === 'hr') {
      // Admins and HR can see all tasks
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email');
    } else {
      // Employees can only see their own tasks
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email');
    }
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('comments.user', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to view this task
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && 
        req.user.id !== task.assignedTo._id.toString() && 
        req.user.id !== task.assignedBy._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Admin, HR)
router.post('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      status,
      priority,
      dueDate
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private (Admin, HR, Assigned Employee)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to update this task
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && 
        req.user.id !== task.assignedTo.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (status) taskFields.status = status;
    if (priority) taskFields.priority = priority;
    if (dueDate) taskFields.dueDate = dueDate;

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add a comment to a task
// @access  Private (Admin, HR, Assigned Employee)
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to comment on this task
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && 
        req.user.id !== task.assignedTo.toString() && 
        req.user.id !== task.assignedBy.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Add comment
    task.comments.unshift({
      user: req.user.id,
      text,
      date: Date.now()
    });

    await task.save();

    res.json(task.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Admin, HR)
router.delete('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndRemove(req.params.id);

    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
