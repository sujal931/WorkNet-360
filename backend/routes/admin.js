
const express = require('express');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const JobApplication = require('../models/JobApplication');
const Task = require('../models/Task');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (employees, HRs, admins)
// @access  Private (Admin only)
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password')
      .sort({ role: 1, name: 1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/create-user
// @desc    Create a new user (employee or HR)
// @access  Private (Admin only)
router.post('/create-user', auth, authorize('admin'), async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      department,
      position,
      gender,
      phoneNumber,
      dateOfBirth,
      joinDate
    } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email and role are required' });
    }
    
    if (role !== 'employee' && role !== 'hr') {
      return res.status(400).json({ message: 'Role must be employee or hr' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password: password || 'changeme123', // Default password
      role,
      department,
      position,
      gender,
      phoneNumber,
      dateOfBirth,
      joinDate: joinDate || Date.now(),
      status: 'approved'
    });
    
    await user.save();
    
    // If the user is an employee, create an employee record
    if (role === 'employee') {
      const employee = new Employee({
        userId: user._id,
        employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
        department: department || '',
        position: position || '',
        salary: 0,
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
      
      await employee.save();
    }
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/hr-leave-requests
// @desc    Get leave requests from HR staff
// @access  Private (Admin only)
router.get('/hr-leave-requests', auth, authorize('admin'), async (req, res) => {
  try {
    const hrUsers = await User.find({ role: 'hr' }).select('_id');
    const hrIds = hrUsers.map(hr => hr._id);
    
    const leaveRequests = await Leave.find({
      employee: { $in: hrIds }
    })
    .populate('employee', 'name email department position')
    .populate('approvedBy', 'name email')
    .sort({ submittedDate: -1 });
    
    res.json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/hr-leave-requests/:id/approve
// @desc    Approve HR leave request
// @access  Private (Admin only)
router.put('/hr-leave-requests/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const { comments } = req.body;
    
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Verify it's an HR's leave request
    const employee = await User.findById(leave.employee);
    if (!employee || employee.role !== 'hr') {
      return res.status(400).json({ message: 'This is not an HR leave request' });
    }
    
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }
    
    // Update leave request
    leave.status = 'Approved';
    leave.approvedBy = req.user.id;
    leave.processedDate = new Date();
    if (comments) leave.comments = comments;
    
    await leave.save();
    
    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/hr-leave-requests/:id/reject
// @desc    Reject HR leave request
// @access  Private (Admin only)
router.put('/hr-leave-requests/:id/reject', auth, authorize('admin'), async (req, res) => {
  try {
    const { comments } = req.body;
    
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Verify it's an HR's leave request
    const employee = await User.findById(leave.employee);
    if (!employee || employee.role !== 'hr') {
      return res.status(400).json({ message: 'This is not an HR leave request' });
    }
    
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }
    
    // Update leave request
    leave.status = 'Rejected';
    leave.approvedBy = req.user.id;
    leave.processedDate = new Date();
    if (comments) leave.comments = comments;
    
    await leave.save();
    
    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/job-outcomes
// @desc    Get summary of accepted job applications
// @access  Private (Admin only)
router.get('/job-outcomes', auth, authorize('admin'), async (req, res) => {
  try {
    const acceptedApplications = await JobApplication.find({ status: 'Hired' })
      .populate('job', 'title department')
      .populate('applicant', 'name email')
      .sort({ updatedAt: -1 });
    
    res.json(acceptedApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics/employees
// @desc    Get employee analytics data
// @access  Private (Admin only)
router.get('/analytics/employees', auth, authorize('admin'), async (req, res) => {
  try {
    // Get total counts by department
    const departmentCounts = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get total counts by position
    const positionCounts = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: '$position', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get HR staff count
    const hrCount = await User.countDocuments({ role: 'hr' });
    
    // Get employee count
    const employeeCount = await User.countDocuments({ role: 'employee' });
    
    res.json({
      totalEmployees: employeeCount,
      totalHR: hrCount,
      departments: departmentCounts,
      positions: positionCounts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics/tasks
// @desc    Get task analytics data
// @access  Private (Admin only)
router.get('/analytics/tasks', auth, authorize('admin'), async (req, res) => {
  try {
    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Tasks assigned per department
    const tasksByDepartment = await Task.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignee'
        }
      },
      { $unwind: '$assignee' },
      { $group: { _id: '$assignee.department', count: { $sum: 1 } } }
    ]);
    
    res.json({
      tasksByStatus,
      tasksByPriority,
      tasksByDepartment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/user/:id
// @desc    Get a specific user's details
// @access  Private (Admin only)
router.get('/user/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let employeeData = null;
    if (user.role === 'employee') {
      employeeData = await Employee.findOne({ userId: user._id });
    }
    
    res.json({
      user,
      employee: employeeData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
