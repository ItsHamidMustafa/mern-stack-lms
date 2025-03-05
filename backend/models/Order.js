const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  },
  datePlaced: {
    type: Date,
    default: Date.now()
  },
  shippingAddress: {
    type: Object,
    required: true
  },
  paymentInfo: {
    type: Object,
    required: false
  },
  deletedByUser: {
    type: Boolean,
    defalt: false,
    required: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('orders', orderSchema);