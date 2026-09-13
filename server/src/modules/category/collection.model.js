import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: String,
  heroImage: { url: String, altText: String },
  seoTitle: String,
  metaDescription: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
