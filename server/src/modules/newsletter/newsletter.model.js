import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    source: {
      type: String,
      default: 'home_page',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
