
const express = require('express');
const Attendance = require('../models/Attendance');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/attendance
// @desc    Get attendance records (filtered by role and date)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Add date filter if month and year are provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    // Filter by employee based on role
    if (req.user.role === 'admin' || req.user.role === 'hr') {
      // Admins and HR can see all or specific employee records
      if (employeeId) {
        filter.employee = employeeId;
      }
    } else {
      // Employees can only see their own records
      filter.employee = req.user.id;
    }
    
    const attendanceRecords = await Attendance.find(filter)
      .populate('employee', 'name email')
      .sort({ date: -1 });
    
    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance/check-in
// @desc    Record check-in
// @access  Private
router.post('/check-in', auth, async (req, res) => {
  try {
    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingRecord = await Attendance.findOne({
      employee: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (existingRecord && existingRecord.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    
    const now = new Date();
    
    if (existingRecord) {
      // Update existing record
      existingRecord.checkIn = now;
      existingRecord.status = 'Present';
      await existingRecord.save();
      return res.json(existingRecord);
    }
    
    // Create new attendance record
    const attendance = new Attendance({
      employee: req.user.id,
      date: today,
      checkIn: now,
      status: 'Present'
    });
    
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance/check-out
// @desc    Record check-out
// @access  Private
router.post('/check-out', auth, async (req, res) => {
  try {
    // Find today's record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const attendanceRecord = await Attendance.findOne({
      employee: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (!attendanceRecord) {
      return res.status(400).json({ message: 'No check-in record found for today' });
    }
    
    if (attendanceRecord.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }
    
    const now = new Date();
    
    // Calculate work hours
    const checkInTime = new Date(attendanceRecord.checkIn);
    const workHours = (now - checkInTime) / (1000 * 60 * 60);
    
    // Update record
    attendanceRecord.checkOut = now;
    attendanceRecord.workHours = parseFloat(workHours.toFixed(2));
    
    await attendanceRecord.save();
    res.json(attendanceRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance/manual
// @desc    Manually record attendance
// @access  Private (Admin, HR)
router.post('/manual', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { employee, date, status, checkIn, checkOut, workHours, notes } = req.body;
    
    // Check if record already exists for this date
    const existingRecord = await Attendance.findOne({
      employee,
      date: new Date(date)
    });
    
    if (existingRecord) {
      return res.status(400).json({ message: 'Attendance record already exists for this date' });
    }
    
    // Create new record
    const attendance = new Attendance({
      employee,
      date: new Date(date),
      status,
      notes
    });
    
    if (checkIn) attendance.checkIn = new Date(checkIn);
    if (checkOut) attendance.checkOut = new Date(checkOut);
    if (workHours) attendance.workHours = workHours;
    
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update attendance record
// @access  Private (Admin, HR)
router.put('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { status, checkIn, checkOut, workHours, notes } = req.body;
    
    let attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    // Build update object
    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes) updateFields.notes = notes;
    
    if (checkIn) updateFields.checkIn = new Date(checkIn);
    if (checkOut) updateFields.checkOut = new Date(checkOut);
    
    if (workHours) {
      updateFields.workHours = workHours;
    } else if (checkIn && checkOut) {
      // Calculate work hours
      const checkInTime = new Date(checkIn);
      const checkOutTime = new Date(checkOut);
      const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
      updateFields.workHours = parseFloat(workHours.toFixed(2));
    }
    
    // Update record
    attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
