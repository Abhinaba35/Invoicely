const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client: {
    name: String,
    email: String,
    address: String
  },
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
      tax: Number
    }
  ],
  total: Number,
  status: { type: String, enum: ['unpaid', 'paid', 'overdue'], default: 'unpaid' },
  dueDate: Date,
  recurring: { type: Boolean, default: false },
  pdfUrl: String,
  paymentLink: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema); 
