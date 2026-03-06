
const express = require('express');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');
const Task = require('../models/Task');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/hr/employees
// @desc    Get all employees (not HR or Admin)
// @access  Private (HR only)
router.get('/employees', auth, authorize('hr'), async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hr/employees/:id
// @desc    Get a specific employee's details
// @access  Private (HR only)
router.get('/employees/:id', auth, authorize('hr'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    if (user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied - you can only view employee records' });
    }
    
    // Get employee details
    const employee = await Employee.findOne({ userId: user._id });
    
    res.json({
      user,
      employee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hr/pending-users
// @desc    Get all users with pending approval status
// @access  Private (HR only)
router.get('/pending-users', auth, authorize('hr'), async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      status: 'pending', 
      role: 'employee' 
    }).select('-password');
    
    res.json(pendingUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/hr/create-employee
// @desc    Create a new employee with complete employment info
// @access  Private (HR only)
router.post('/create-employee', auth, authorize('hr'), async (req, res) => {
  try {
    const { 
      name,
      email,
      password,
      gender,
      phoneNumber, 
      dateOfBirth,
      employeeId, 
      department, 
      position, 
      joinDate, 
      workLocation, 
      manager 
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !department || !position) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Check if user already exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }
    
    // Create user
    const newUser = new User({
      name,
      email,
      password: password || 'changeme123', // Default password if not provided
      gender,
      phoneNumber,
      dateOfBirth,
      department,
      position,
      joinDate: joinDate || new Date(),
      status: 'approved',
      role: 'employee'
    });
    
    await newUser.save();
    
    // Create employee record
    const newEmployee = new Employee({
      userId: newUser._id,
      employeeId: employeeId || ('EMP-' + Math.floor(1000 + Math.random() * 9000)),
      department,
      position,
      salary: 0, // Default value, can be updated later
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    });
    
    if (workLocation) {
      newEmployee.workLocation = workLocation;
    }
    
    if (manager) {
      newEmployee.manager = manager;
    }
    
    await newEmployee.save();
    
    res.json({
      message: 'Employee created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        position: newUser.position,
        status: newUser.status
      },
      employee: newEmployee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/hr/approve-employee/:id
// @desc    Approve a pending employee and add employment details
// @access  Private (HR only)
router.put('/approve-employee/:id', auth, authorize('hr'), async (req, res) => {
  try {
    const { 
      department,
      position,
      joinDate,
      employeeId,
      workLocation,
      manager,
    } = req.body;
    
    // Find the user and verify it's a pending employee
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'employee') {
      return res.status(403).json({ message: 'You can only approve employee accounts' });
    }
    
    if (user.status !== 'pending') {
      return res.status(400).json({ message: 'This user is already approved or rejected' });
    }
    
    // Update user status and info
    user.status = 'approved';
    if (department) user.department = department;
    if (position) user.position = position;
    if (joinDate) user.joinDate = joinDate;
    
    await user.save();
    
    // Create or update employee record
    let employee = await Employee.findOne({ userId: user._id });
    
    if (!employee) {
      employee = new Employee({
        userId: user._id,
        employeeId: employeeId || ('EMP-' + Math.floor(1000 + Math.random() * 9000)),
        department: department || '',
        position: position || '',
        salary: 0
      });
    } else {
      if (department) employee.department = department;
      if (position) employee.position = position;
      if (employeeId) employee.employeeId = employeeId;
      if (workLocation) employee.workLocation = workLocation;
      if (manager) employee.manager = manager;
    }
    
    await employee.save();
    
    res.json({
      message: 'Employee approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        department: user.department,
        position: user.position
      },
      employee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/hr/employees/:id
// @desc    Update an employee's information
// @access  Private (HR only)
router.put('/employees/:id', auth, authorize('hr'), async (req, res) => {
  try {
    const { 
      name,
      email,
      gender,
      phoneNumber,
      dateOfBirth,
      department,
      position,
      joinDate,
      employeeId,
      workLocation,
      manager,
      salary
    } = req.body;
    
    // Find the user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    if (user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied - you can only update employee records' });
    }
    
    // Update user information
    if (name) user.name = name;
    if (email) user.email = email;
    if (gender) user.gender = gender;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (department) user.department = department;
    if (position) user.position = position;
    if (joinDate) user.joinDate = joinDate;
    
    await user.save();
    
    // Update or create employee record
    let employee = await Employee.findOne({ userId: user._id });
    
    if (!employee) {
      employee = new Employee({
        userId: user._id,
        employeeId: employeeId || 'EMP-' + Math.floor(1000 + Math.random() * 9000),
        department,
        position,
        salary: 0,
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    } else {
      if (employeeId) employee.employeeId = employeeId;
      if (department) employee.department = department;
      if (position) employee.position = position;
      if (salary !== undefined) employee.salary = salary;
      if (workLocation) employee.workLocation = workLocation;
      if (manager) employee.manager = manager;
    }
    
    await employee.save();
    
    res.json({
      message: 'Employee information updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position
      },
      employee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hr/leave-requests
// @desc    Get all leave requests from employees (not HR)
// @access  Private (HR only)
router.get('/leave-requests', auth, authorize('hr'), async (req, res) => {
  try {
    // Get all employee users (not HR or admin)
    const employees = await User.find({ role: 'employee' }).select('_id');
    const employeeIds = employees.map(emp => emp._id);
    
    // Get leave requests from these employees
    const leaveRequests = await Leave.find({ 
      employee: { $in: employeeIds }
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

// @route   GET /api/hr/tasks
// @desc    Get all tasks assigned by the HR
// @access  Private (HR only)
router.get('/tasks', auth, authorize('hr'), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user.id })
      .populate('assignedTo', 'name email department position')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hr/dashboard-stats
// @desc    Get HR dashboard statistics
// @access  Private (HR only)
router.get('/dashboard-stats', auth, authorize('hr'), async (req, res) => {
  try {
    // Get employee IDs
    const employees = await User.find({ role: 'employee' }).select('_id');
    const employeeIds = employees.map(emp => emp._id);
    
    // Count pending leave requests
    const pendingLeaves = await Leave.countDocuments({ 
      employee: { $in: employeeIds },
      status: 'Pending'
    });
    
    // Count pending approvals (new employee registrations)
    const pendingApprovals = await User.countDocuments({ 
      role: 'employee',
      status: 'pending'
    });
    
    // Count tasks assigned by this HR
    const tasksAssigned = await Task.countDocuments({ 
      assignedBy: req.user.id
    });
    
    res.json({
      pendingLeaves,
      pendingApprovals,
      tasksAssigned,
      // Add more stats as needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
