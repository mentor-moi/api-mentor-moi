const mongoose = require("mongoose")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 100,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes

  return resetToken
}

module.exports = mongoose.model("User", userSchema)
