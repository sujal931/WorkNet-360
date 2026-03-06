
const express = require('express');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/payroll
// @desc    Get payroll records (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { month, year, employeeId, status } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Add period filter if month and year are provided
    if (month && year) {
      filter['period.month'] = parseInt(month);
      filter['period.year'] = parseInt(year);
    }
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Filter by employee based on role
    if (req.user.role === 'admin' || req.user.role === 'hr') {
      // Admins and HR can see all or specific employee records
      if (employeeId) {
        filter.employee = employeeId;
      }
    } else {
      // Employees can only see their own records
      // First, find the employee record for this user
      const employee = await Employee.findOne({ userId: req.user.id });
      
      if (!employee) {
        return res.status(404).json({ message: 'Employee record not found' });
      }
      
      filter.employee = employee._id;
    }
    
    const payrolls = await Payroll.find(filter)
      .populate({
        path: 'employee',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ 'period.year': -1, 'period.month': -1 });
    
    res.json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payroll/:id
// @desc    Get payroll record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: 'employee',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });
    
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    // Check if user is authorized to view this payroll
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      // Find the employee record for this user
      const employee = await Employee.findOne({ userId: req.user.id });
      
      if (!employee || employee._id.toString() !== payroll.employee._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payroll/generate
// @desc    Generate payroll for a month
// @access  Private (Admin, HR)
router.post('/generate', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { month, year, employeeId } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    // Check if payroll already exists for this period
    let filter = {
      'period.month': parseInt(month),
      'period.year': parseInt(year)
    };
    
    if (employeeId) {
      filter.employee = employeeId;
    }
    
    const existingPayroll = await Payroll.findOne(filter);
    
    if (existingPayroll) {
      return res.status(400).json({ message: 'Payroll already generated for this period' });
    }
    
    // Get employees to generate payroll for
    let employees;
    
    if (employeeId) {
      employees = await Employee.find({ _id: employeeId });
    } else {
      employees = await Employee.find();
    }
    
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
    
    // Generate payroll for each employee
    const payrolls = [];
    
    for (const employee of employees) {
      // Get attendance records for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const attendanceRecords = await Attendance.find({
        employee: employee.userId,
        date: { $gte: startDate, $lte: endDate },
        status: 'Present'
      });
      
      const workDays = attendanceRecords.length;
      const totalWorkHours = attendanceRecords.reduce((sum, record) => sum + (record.workHours || 0), 0);
      
      // Calculate salary (simplified for demo)
      const baseSalary = employee.salary;
      const calculatedSalary = baseSalary;
      
      // Create payroll record
      const payroll = new Payroll({
        employee: employee._id,
        period: {
          month: parseInt(month),
          year: parseInt(year)
        },
        baseSalary,
        bonuses: [],
        deductions: [],
        taxDeductions: calculatedSalary * 0.2, // Simplified tax calculation
        netSalary: calculatedSalary * 0.8,
        status: 'Draft',
        notes: `Worked ${workDays} days, ${totalWorkHours.toFixed(2)} hours`
      });
      
      await payroll.save();
      payrolls.push(payroll);
    }
    
    res.status(201).json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/payroll/:id
// @desc    Update payroll record
// @access  Private (Admin, HR)
router.put('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { baseSalary, bonuses, deductions, taxDeductions, status, paymentDate, paymentMethod, notes } = req.body;
    
    let payroll = await Payroll.findById(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    // Build update object
    const updateFields = {};
    if (baseSalary) updateFields.baseSalary = baseSalary;
    if (bonuses) updateFields.bonuses = bonuses;
    if (deductions) updateFields.deductions = deductions;
    if (taxDeductions) updateFields.taxDeductions = taxDeductions;
    if (status) updateFields.status = status;
    if (paymentDate) updateFields.paymentDate = paymentDate;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;
    if (notes) updateFields.notes = notes;
    
    // Calculate net salary if any salary components changed
    if (baseSalary || bonuses || deductions || taxDeductions) {
      let netSalary = baseSalary || payroll.baseSalary;
      
      // Add bonuses
      const totalBonuses = (bonuses || payroll.bonuses).reduce((sum, bonus) => sum + bonus.amount, 0);
      netSalary += totalBonuses;
      
      // Subtract deductions
      const totalDeductions = (deductions || payroll.deductions).reduce((sum, deduction) => sum + deduction.amount, 0);
      netSalary -= totalDeductions;
      
      // Subtract tax
      netSalary -= (taxDeductions || payroll.taxDeductions);
      
      updateFields.netSalary = netSalary;
    }
    
    // Update payroll
    payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/payroll/:id/process
// @desc    Process payroll (change status to Processed)
// @access  Private (Admin, HR)
router.put('/:id/process', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    let payroll = await Payroll.findById(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    if (payroll.status !== 'Draft') {
      return res.status(400).json({ message: 'Payroll is already processed' });
    }
    
    payroll.status = 'Processed';
    await payroll.save();
    
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/payroll/:id/pay
// @desc    Mark payroll as paid
// @access  Private (Admin, HR)
router.put('/:id/pay', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { paymentMethod, paymentDate } = req.body;
    
    let payroll = await Payroll.findById(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    if (payroll.status !== 'Processed') {
      return res.status(400).json({ message: 'Payroll must be in Processed status before marking as Paid' });
    }
    
    payroll.status = 'Paid';
    payroll.paymentDate = paymentDate || new Date();
    if (paymentMethod) payroll.paymentMethod = paymentMethod;
    
    await payroll.save();
    
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
