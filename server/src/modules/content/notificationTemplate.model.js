import mongoose from 'mongoose';

const notificationTemplateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subject: String,
  body: { type: String, required: true },
  availableTokens: [String],
  channel: { type: String, enum: ['EMAIL', 'WHATSAPP', 'BOTH'], default: 'EMAIL' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const NotificationTemplate = mongoose.model('NotificationTemplate', notificationTemplateSchema);
export default NotificationTemplate;
