import { Newsletter } from './newsletter.model.js';
import { ApiError } from '../../lib/ApiError.js';

// POST /api/v1/newsletter/subscribe — Public
export const subscribe = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email) throw ApiError.badRequest('Email is required');

    // Upsert: if already exists just return success (don't throw error)
    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
        alreadySubscribed: true,
      });
    }

    const subscriber = await Newsletter.create({
      email: email.toLowerCase().trim(),
      name: name?.trim() || '',
      source: req.body.source || 'home_page',
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed!',
      subscriber: { email: subscriber.email, subscribedAt: subscriber.createdAt },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!', alreadySubscribed: true });
    }
    next(err);
  }
};

// GET /api/v1/newsletter — Admin only
export const getSubscribers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      Newsletter.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('email name source createdAt'),
      Newsletter.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      data: subscribers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/newsletter/:id — Admin only (unsubscribe)
export const unsubscribe = async (req, res, next) => {
  try {
    await Newsletter.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    next(err);
  }
};
