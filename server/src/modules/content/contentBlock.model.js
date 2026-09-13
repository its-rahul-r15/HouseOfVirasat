import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  type: {
    type: String,
    enum: ['BANNER', 'SECTION', 'PAGE', 'FAQ', 'JOURNAL'],
    required: true,
  },
  title: String,
  subtitle: String,
  body: String,
  images: [{ url: String, altText: String, link: String }],
  ctaLabel: String,
  ctaLink: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  meta: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

const ContentBlock = mongoose.model('ContentBlock', contentBlockSchema);
export default ContentBlock;
