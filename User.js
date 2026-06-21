const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: true // Ensure password is returned, we will handle exclusion when needed or keep standard
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    savedAddresses: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
      }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcryptjs before saving user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiration time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
