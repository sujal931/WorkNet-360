
const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  period: {
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  baseSalary: {
    type: Number,
    required: true
  },
  bonuses: [{
    type: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String
  }],
  deductions: [{
    type: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String
  }],
  taxDeductions: {
    type: Number,
    required: true
  },
  netSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Processed', 'Paid'],
    default: 'Draft'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Check', 'Cash'],
    default: 'Bank Transfer'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payroll', PayrollSchema);
