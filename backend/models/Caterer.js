const mongoose = require("mongoose");

const CatererSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cuisine: {
    type: [String],
    required: true,
  },
  minGuests: {
    type: Number,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  pricePerPerson: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Caterer", CatererSchema);


