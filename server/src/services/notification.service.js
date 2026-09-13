import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import NotificationTemplate from '../modules/content/notificationTemplate.model.js';
import logger from '../lib/logger.js';

function createTransporter() {
  if (env.EMAIL_PROVIDER === 'resend') {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: { user: 'resend', pass: env.RESEND_API_KEY },
    });
  }

  if (env.EMAIL_PROVIDER === 'brevo') {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: { user: env.BREVO_API_KEY, pass: env.BREVO_API_KEY },
    });
  }

  if (env.EMAIL_PROVIDER === 'ses') {
    return nodemailer.createTransport({
      host: `email-smtp.${env.AWS_SES_REGION}.amazonaws.com`,
      port: 465,
      secure: true,
      auth: { user: env.AWS_SES_ACCESS_KEY, pass: env.AWS_SES_SECRET_KEY },
    });
  }

  throw new Error(`Unknown EMAIL_PROVIDER: ${env.EMAIL_PROVIDER}`);
}

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

function replaceTokens(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

export async function sendEmail(templateKey, recipient, vars = {}) {
  const template = await NotificationTemplate.findOne({ key: templateKey, isActive: true });

  if (!template) {
    logger.warn(`Email template not found: ${templateKey}`);
    return;
  }

  const subject = replaceTokens(template.subject || '', vars);
  const html = replaceTokens(template.body, vars);

  try {
    await getTransporter().sendMail({
      from: `House of Virasat <${env.EMAIL_FROM}>`,
      to: recipient,
      subject,
      html,
    });
    logger.info(`Email sent: ${templateKey} → ${recipient}`);
  } catch (err) {
    logger.error(`Email send failed: ${templateKey} → ${recipient}: ${err.message}`);
  }
}

export async function sendNotification({ templateKey, to, variables = {} }) {
  return sendEmail(templateKey, to, variables);
}

export async function sendWhatsApp(number, message) {
  // Phase 1: wa.me deep links are client-side only.
  // This hook is for future WhatsApp Business API integration.
  logger.info(`WhatsApp notification queued for ${number}: ${message.slice(0, 50)}...`);
}
