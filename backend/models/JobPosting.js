
const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  isInternal: {
    type: Boolean,
    default: false
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Draft'],
    default: 'Open'
  },
  applications: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobApplication'
    }],
    default: []
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  closingDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Ensure applications is always an array, even if it's null/undefined
      if (!ret.applications) {
        ret.applications = [];
      }
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Ensure applications is always an array, even if it's null/undefined
      if (!ret.applications) {
        ret.applications = [];
      }
      return ret;
    }
  }
});

module.exports = mongoose.model('JobPosting', JobPostingSchema);
