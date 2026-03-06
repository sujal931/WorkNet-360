
const express = require('express');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private (Admin, HR)
router.get('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId', 'name email role');
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private (Admin, HR, Own Employee)
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'name email role');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if user is admin, HR, or the employee themselves
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.user.id !== employee.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private (Admin, HR)
router.post('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { userId, employeeId, department, position, salary, address, phoneNumber, emergencyContact } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if employee record already exists for this user
    let employee = await Employee.findOne({ userId });
    if (employee) {
      return res.status(400).json({ message: 'Employee record already exists for this user' });
    }

    // Create new employee
    employee = new Employee({
      userId,
      employeeId,
      department,
      position,
      salary,
      address,
      phoneNumber,
      emergencyContact
    });

    await employee.save();

    // Update user with department and position
    user.department = department;
    user.position = position;
    await user.save();

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update an employee
// @access  Private (Admin, HR)
router.put('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { department, position, salary, address, phoneNumber, emergencyContact } = req.body;

    // Build employee object
    const employeeFields = {};
    if (department) employeeFields.department = department;
    if (position) employeeFields.position = position;
    if (salary) employeeFields.salary = salary;
    if (address) employeeFields.address = address;
    if (phoneNumber) employeeFields.phoneNumber = phoneNumber;
    if (emergencyContact) employeeFields.emergencyContact = emergencyContact;

    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee
    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true }
    );

    // Update related user if department or position changed
    if (department || position) {
      const user = await User.findById(employee.userId);
      if (department) user.department = department;
      if (position) user.position = position;
      await user.save();
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.findByIdAndRemove(req.params.id);

    res.json({ message: 'Employee removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
