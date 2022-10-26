const mongoose = require('mongoose');

const RideScheme = new mongoose.Schema({
  source: {
    type: {
      name: String,
      latitude: Number,
      longitude: Number,
    },
    required: true,
  },
  destination: {
    type: {
      name: String,
      latitude: Number,
      longitude: Number,
    },
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  driver: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  passenger: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  },
  rating: {
    type: Number,
  },
}, { timestamps: true });

const Ride = mongoose.model('Rides', RideScheme);

module.exports = Ride;
