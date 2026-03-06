const express = require('express');
const Leave = require('../models/Leave');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/leaves
// @desc    Get all leave requests (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let leaves;
    
    if (req.user.role === 'admin') {
      // Admins can see all leave requests
      leaves = await Leave.find()
        .populate('employee', 'name email department position role')
        .populate('approvedBy', 'name email');
    } else if (req.user.role === 'hr') {
      // HR can only see employee leave requests (not HR or Admin)
      const employees = await User.find({ role: 'employee' }).select('_id');
      const employeeIds = employees.map(emp => emp._id);
      
      leaves = await Leave.find({ employee: { $in: employeeIds } })
        .populate('employee', 'name email department position')
        .populate('approvedBy', 'name email')
        .sort({ submittedDate: -1 });
    } else {
      // Employees can only see their own leave requests
      leaves = await Leave.find({ employee: req.user.id })
        .populate('employee', 'name email')
        .populate('approvedBy', 'name email')
        .sort({ submittedDate: -1 });
    }
    
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/history
// @desc    Get leave history for the current user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/:id
// @desc    Get leave request by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'name email role department position')
      .populate('approvedBy', 'name email');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user is authorized to view this leave request
    if (req.user.role === 'admin') {
      // Admin can see all leave requests
    } else if (req.user.role === 'hr') {
      // HR can see leave requests from employees only
      const employee = await User.findById(leave.employee._id);
      if (employee.role !== 'employee') {
        return res.status(403).json({ message: 'Not authorized - HR can only view employee leave requests' });
      }
    } else if (req.user.id !== leave.employee._id.toString()) {
      // Employees can only see their own leave requests
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/leaves
// @desc    Create a new leave request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end day
    
    const leave = new Leave({
      employee: req.user.id,
      leaveType,
      startDate,
      endDate,
      days: diffDays,
      reason,
      status: 'Pending',
      submittedDate: new Date()
    });

    await leave.save();

    res.status(201).json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/leaves/:id/approve
// @desc    Approve a leave request (HR approves employee leaves, Admin approves HR leaves)
// @access  Private (Admin, HR)
router.put('/:id/approve', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { comments } = req.body;

    let leave = await Leave.findById(req.params.id)
      .populate('employee', 'name email role');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }
    
    // Check appropriate approval authority based on employee role
    if (req.user.role === 'hr') {
      // HR can only approve employee leave requests
      if (leave.employee.role !== 'employee') {
        return res.status(403).json({ message: 'HR can only approve employee leave requests' });
      }
    } else if (req.user.role === 'admin') {
      // Admin can approve any leave request
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

// @route   PUT /api/leaves/:id/reject
// @desc    Reject a leave request (HR rejects employee leaves, Admin rejects HR leaves)
// @access  Private (Admin, HR)
router.put('/:id/reject', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { comments } = req.body;

    let leave = await Leave.findById(req.params.id)
      .populate('employee', 'name email role');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }
    
    // Check appropriate approval authority based on employee role
    if (req.user.role === 'hr') {
      // HR can only reject employee leave requests
      if (leave.employee.role !== 'employee') {
        return res.status(403).json({ message: 'HR can only reject employee leave requests' });
      }
    } else if (req.user.role === 'admin') {
      // Admin can reject any leave request
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

// @route   PUT /api/leaves/:id/cancel
// @desc    Cancel a leave request
// @access  Private (Employee who created it)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    let leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user is authorized to cancel this leave request
    if (req.user.id !== leave.employee.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot cancel a processed leave request' });
    }

    // Delete the leave request
    await Leave.findByIdAndRemove(req.params.id);

    res.json({ message: 'Leave request cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
