
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phoneNumber: {
    type: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  documents: [
    {
      name: String,
      url: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);
