const mongoose = require('mongoose');

const DeviceScheme = new mongoose.Schema({
  firebaseToken: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// DeviceScheme.statics.isNameTaken = async function (name) {
//   const area = await this.findOne({ name });
//   return !!area;
// };

const Device = mongoose.model('Devices', DeviceScheme);

module.exports = Device;
