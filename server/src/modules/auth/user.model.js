import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  tag: { type: String, default: 'Home / Primary Residence' },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true, select: false },

  tier: {
    type: String,
    enum: ['Virasat Patron', 'Virasat Connoisseur', 'Royal Guild Member'],
    default: 'Virasat Connoisseur',
  },

  anniversary: String,
  birthday: String,

  addresses: [addressSchema],

  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
  refreshTokenHash: { type: String, select: false },
}, {
  timestamps: true,
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject ? this.toObject() : { ...this };
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
