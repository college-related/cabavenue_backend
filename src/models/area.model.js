const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const areaScheme = mongoose.Schema(
  {
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
          ref: 'users',
        },
      }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
areaScheme.plugin(toJSON);
areaScheme.plugin(paginate);

/**
 * @typedef Area
 */
const Area = mongoose.model('Areas', areaScheme);

module.exports = Area;
