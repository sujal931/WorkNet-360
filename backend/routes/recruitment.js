
const express = require('express');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, or DOCX files are allowed!'));
  }
});

// Job Postings Routes

// @route   GET /api/recruitment/jobs
// @desc    Get all job postings (filtered by internal flag)
// @access  Private
router.get('/jobs', auth, async (req, res) => {
  try {
    const { internal } = req.query;
    let filter = {};
    
    // Filter by job status
    filter.status = 'Open';
    
    // Filter by internal flag based on role
    if (internal === 'true') {
      filter.isInternal = true;
    } else if (req.user.role === 'admin' || req.user.role === 'hr') {
      // Admin and HR can see all jobs by default
    } else {
      // Regular employees can only see non-internal jobs and internal jobs
      filter.$or = [{ isInternal: false }, { isInternal: true }];
    }
    
    const jobs = await JobPosting.find(filter)
      .populate('postedBy', 'name')
      .sort({ postedDate: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/recruitment/jobs/:id
// @desc    Get job posting by ID
// @access  Private
router.get('/jobs/:id', auth, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate({
        path: 'applications',
        populate: {
          path: 'applicant',
          select: 'name email'
        }
      });
    
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    
    // Check if user has access to this job
    if (job.isInternal && req.user.role === 'employee') {
      // Regular employees can only see internal jobs if they are internal
      if (!job.isInternal) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/recruitment/jobs
// @desc    Create a new job posting
// @access  Private (Admin, HR)
router.post('/jobs', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { 
      title, department, location, type, description, 
      requirements, salary, isInternal, closingDate 
    } = req.body;
    
    const job = new JobPosting({
      title,
      department,
      location,
      type,
      description,
      requirements,
      salary,
      isInternal: isInternal || false,
      postedBy: req.user.id,
      postedDate: Date.now(),
      closingDate: closingDate || null
    });
    
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/recruitment/jobs/:id
// @desc    Update a job posting
// @access  Private (Admin, HR)
router.put('/jobs/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { 
      title, department, location, type, description, 
      requirements, salary, isInternal, status, closingDate 
    } = req.body;
    
    let job = await JobPosting.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    
    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (department) updateFields.department = department;
    if (location) updateFields.location = location;
    if (type) updateFields.type = type;
    if (description) updateFields.description = description;
    if (requirements) updateFields.requirements = requirements;
    if (salary) updateFields.salary = salary;
    if (typeof isInternal !== 'undefined') updateFields.isInternal = isInternal;
    if (status) updateFields.status = status;
    if (closingDate) updateFields.closingDate = closingDate;
    
    // Update job
    job = await JobPosting.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/recruitment/jobs/:id
// @desc    Delete a job posting
// @access  Private (Admin, HR)
router.delete('/jobs/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    
    // Delete all applications for this job
    await JobApplication.deleteMany({ job: req.params.id });
    
    // Delete the job
    await JobPosting.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Job posting and related applications removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Job Applications Routes

// @route   GET /api/recruitment/applications
// @desc    Get all job applications (filtered by role)
// @access  Private
router.get('/applications', auth, async (req, res) => {
  try {
    const { jobId, status } = req.query;
    let filter = {};
    
    // Add job filter if provided
    if (jobId) {
      filter.job = jobId;
    }
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Filter based on role
    if (req.user.role === 'admin' || req.user.role === 'hr') {
      // Admin and HR can see all applications
    } else {
      // Employees can only see their own applications
      filter.applicant = req.user.id;
    }
    
    const applications = await JobApplication.find(filter)
      .populate('job', 'title department')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/recruitment/applications/:id
// @desc    Get job application by ID
// @access  Private
router.get('/applications/:id', auth, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate('job', 'title department isInternal')
      .populate('applicant', 'name email')
      .populate('notes.by', 'name');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user has access to this application
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      if (!application.applicant || req.user.id !== application.applicant._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/recruitment/applications
// @desc    Submit a job application
// @access  Mixed (Public for external, Private for internal)
router.post('/applications', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, name, email, phone, isInternal } = req.body;
    
    // Check if job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }
    
    const resumeUrl = req.file.path;
    
    const application = new JobApplication({
      job: jobId,
      resumeUrl,
      isInternalApplicant: isInternal === 'true'
    });
    
    // Handle internal vs external application
    if (isInternal === 'true') {
      // Check if user is authenticated
      const authHeader = req.header('x-auth-token');
      if (!authHeader) {
        return res.status(401).json({ message: 'Authentication required for internal applications' });
      }
      
      // Verify token (simplified for brevity)
      try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        application.applicant = decoded.id;
      } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      // External application
      application.externalApplicant = {
        name,
        email,
        phone
      };
    }
    
    await application.save();
    
    // Make sure job.applications is initialized
    if (!job.applications) {
      job.applications = [];
    }
    
    // Add to job's applications array
    job.applications.push(application._id);
    await job.save();
    
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/recruitment/applications/:id/status
// @desc    Update application status
// @access  Private (Admin, HR)
router.put('/applications/:id/status', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { status } = req.body;
    
    let application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.status = status;
    await application.save();
    
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/recruitment/applications/:id/notes
// @desc    Add note to application
// @access  Private (Admin, HR)
router.post('/applications/:id/notes', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { text } = req.body;
    
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.notes.push({
      text,
      by: req.user.id,
      date: Date.now()
    });
    
    await application.save();
    
    res.json(application.notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
