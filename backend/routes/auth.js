
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        position: user.position,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/create-employee
// @desc    Create a new employee (for Admin and HR)
// @access  Private (Admin, HR)
router.post('/create-employee', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { 
      name, 
      email, 
      gender, 
      phoneNumber, 
      dateOfBirth, 
      department,
      position,
      employeeId,
      joinDate,
      password
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password: password || 'password123', // Default password or specified
      gender,
      phoneNumber,
      dateOfBirth,
      department,
      position,
      joinDate,
      status: 'approved',
      role: 'employee' // HR can only create employees
    });

    await user.save();

    res.status(201).json({
      message: 'Employee created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        department: user.department,
        position: user.position
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
