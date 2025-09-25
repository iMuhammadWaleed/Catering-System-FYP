const mongoose = require('mongoose');

const catererSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  cuisineTypes: [
    { type: String, trim: true }
  ],
  serviceAreas: [
    { type: String, trim: true }
  ],
  minOrderPrice: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Caterer', catererSchema);


