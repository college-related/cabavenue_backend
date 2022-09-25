const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
  driverList: {
    type: [{
      driverName: String,
      driverId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      },
    }],
    default: [],
  }
}, { timestamps: true });

AreaSchema.statics.isNameTaken = async function (name) {
  const area = await this.findOne({ name });
  return !!area;
};

const Area = mongoose.model('Areas', AreaSchema);

module.exports = Area;
