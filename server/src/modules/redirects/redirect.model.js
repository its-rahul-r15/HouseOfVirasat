import mongoose from 'mongoose';

const redirectSchema = new mongoose.Schema({
  from: { type: String, required: true, unique: true, trim: true },
  to: { type: String, required: true, trim: true },
  isPermanent: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  note: String,
}, {
  timestamps: true,
});

redirectSchema.index({ from: 1, isActive: 1 });

const Redirect = mongoose.model('Redirect', redirectSchema);
export default Redirect;
