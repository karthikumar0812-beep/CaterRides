const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const appliedEventSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  appliedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  phone: { type: String },

  age: { type: Number },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["rider", "organizer"],
    required: true
  },

  servesCompleted: { type: Number, default: 0 },

  rating: { type: Number, default: 0 },

  earnings: { type: Number, default: 0 },

  appliedEvents: [appliedEventSchema]

}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
