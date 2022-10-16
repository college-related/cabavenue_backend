const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if(value.toString().length!=10||(value.toString()[0]+value.toString()[1]!=='98')){
          throw new Error('Invalid phone number');
        }
      }
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    rideHistory: {
      type: [{
        source: String,
        destination: String,
        price: Number,
        driver: {
          type: {
            name: String,
            id: mongoose.SchemaTypes.ObjectId,
          },
        },
        rating: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
      }],
      default: [],
    },
    vehicleData: {
      type: {
        plateNumber: String,
        color: String,
        model: String,
      },
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    area: {
      type: {
        name: String,
        id: mongoose.SchemaTypes.ObjectId,
      },
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if phone number is taken
 * @param {Number} phone
 * @param {ObjectId} [excludeUserId]
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneNumberTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId }});
  return !!user;
}

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
