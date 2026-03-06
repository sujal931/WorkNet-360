
const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isInternalApplicant: {
    type: Boolean,
    default: false
  },
  externalApplicant: {
    name: String,
    email: String,
    phone: String
  },
  resumeUrl: {
    type: String,
    required: true
  },
  coverLetterUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'],
    default: 'Applied'
  },
  parsedSkills: {
    type: [String]
  },
  parsedEducation: [{
    degree: String,
    institution: String,
    year: String
  }],
  notes: [{
    text: String,
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
