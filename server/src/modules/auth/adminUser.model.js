import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ADMIN_ROLE } from '../../config/constants.js';

const permissionsSchema = new mongoose.Schema({
  manageProducts: { type: Boolean, default: false },
  manageOrders: { type: Boolean, default: false },
  manageMto: { type: Boolean, default: false },
  manageBespoke: { type: Boolean, default: false },
  manageContent: { type: Boolean, default: false },
  manageCoupons: { type: Boolean, default: false },
  manageSettings: { type: Boolean, default: false },
  viewReports: { type: Boolean, default: false },
  viewCustomers: { type: Boolean, default: false },
  manageUsers: { type: Boolean, default: false },
}, { _id: false });

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },

  role: {
    type: String,
    enum: Object.values(ADMIN_ROLE),
    default: ADMIN_ROLE.STAFF,
  },
  permissions: { type: permissionsSchema, default: {} },

  totpSecret: { type: String, select: false },
  totpEnabled: { type: Boolean, default: false },

  refreshTokenHash: { type: String, select: false },

  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,

  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
}, {
  timestamps: true,
});

adminUserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

adminUserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminUserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminUserSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 };
  }
  return this.updateOne(updates);
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;
