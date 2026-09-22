import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import AdminUser from './adminUser.model.js';
import User from './user.model.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../lib/ApiError.js';

function signAccessToken(userId, role = 'PATRON') {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY });
}

function signRefreshToken(userId) {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY });
}

export async function registerCustomer({ name, email, phone, password, anniversary, birthday }) {
  const normalizedEmail = email.toLowerCase().trim();

  const existingAdmin = await AdminUser.findOne({ email: normalizedEmail });
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingAdmin || existingUser) {
    throw ApiError.conflict('An account with this email address already exists');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password,
    anniversary,
    birthday,
    tier: 'Virasat Connoisseur',
    isActive: true,
  });

  const accessToken = signAccessToken(user._id, 'PATRON');
  const refreshToken = signRefreshToken(user._id);

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await User.findByIdAndUpdate(user._id, { refreshTokenHash });

  return {
    accessToken,
    refreshToken,
    user: user.toPublicJSON(),
  };
}

export async function loginUser({ email, password, totpCode }) {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`[LOGIN] Attempt for: ${normalizedEmail}`);

  // 1. Check if Admin
  const admin = await AdminUser.findOne({ email: normalizedEmail }).select('+password +totpSecret +refreshTokenHash');

  if (admin) {
    console.log(`[LOGIN] Admin found — isActive: ${admin.isActive}, role: ${admin.role}, totpEnabled: ${admin.totpEnabled}, loginAttempts: ${admin.loginAttempts}, isLocked: ${admin.isLocked}`);

    if (!admin.isActive) {
      console.log('[LOGIN] ❌ Admin is inactive');
      throw ApiError.unauthorized('Account is inactive');
    }

    if (admin.isLocked) {
      console.log('[LOGIN] ❌ Admin account is locked');
      throw ApiError.unauthorized('Admin account locked due to excessive failed attempts. Try again later.');
    }

    const isMatch = await admin.comparePassword(password);
    console.log(`[LOGIN] Password match: ${isMatch}`);

    if (!isMatch) {
      await admin.incrementLoginAttempts();
      console.log('[LOGIN] ❌ Password mismatch — incrementing attempts');
      throw ApiError.unauthorized('Invalid email or password');
    }

    // ── 2FA TEMPORARILY DISABLED ─────────────────────────────────────────
    // Uncomment the block below to re-enable TOTP enforcement.
    //
    // if (admin.totpEnabled) {
    //   if (!totpCode) {
    //     return { requires2FA: true };
    //   }
    //
    //   const verified = speakeasy.totp.verify({
    //     secret: admin.totpSecret,
    //     encoding: 'base32',
    //     token: totpCode,
    //     window: 1,
    //   });
    //
    //   if (!verified) throw ApiError.unauthorized('Invalid 2FA code');
    // } else if (admin.role === 'SUPER_ADMIN' && env.NODE_ENV === 'production') {
    //   // Block SUPER_ADMIN login without 2FA in production — too risky
    //   throw ApiError.forbidden(
    //     'SUPER_ADMIN accounts must have Two-Factor Authentication enabled before logging in on production. ' +
    //     'Set it up via Settings → Security in a development environment first.'
    //   );
    // }
    // ─────────────────────────────────────────────────────────────────────

    console.log('[LOGIN] ✅ Admin login successful');

    await AdminUser.findByIdAndUpdate(admin._id, {
      $set: { loginAttempts: 0, lastLoginAt: new Date() },
      $unset: { lockUntil: 1 },
    });

    const accessToken = signAccessToken(admin._id, admin.role);
    const refreshToken = signRefreshToken(admin._id);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await AdminUser.findByIdAndUpdate(admin._id, { refreshTokenHash });

    const sanitizedAdmin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    };

    return { accessToken, refreshToken, user: sanitizedAdmin };
  }

  console.log(`[LOGIN] No admin found for: ${normalizedEmail} — checking customers`);

  // 2. Check if Customer Patron
  const customer = await User.findOne({ email: normalizedEmail }).select('+password');

  if (customer && customer.isActive) {
    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    await User.findByIdAndUpdate(customer._id, {
      $set: { lastLoginAt: new Date() },
    });

    const accessToken = signAccessToken(customer._id, 'PATRON');
    const refreshToken = signRefreshToken(customer._id);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await User.findByIdAndUpdate(customer._id, {
      $set: { lastLoginAt: new Date(), refreshTokenHash },
    });

    return {
      accessToken,
      refreshToken,
      user: customer.toPublicJSON(),
    };
  }

  console.log(`[LOGIN] ❌ No matching active user found for: ${normalizedEmail}`);
  throw ApiError.unauthorized('Invalid email or password');
}

export async function getMe(userId) {
  const admin = await AdminUser.findById(userId);
  if (admin) {
    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    };
  }

  const customer = await User.findById(userId);
  if (customer) {
    return customer.toPublicJSON();
  }

  throw ApiError.notFound('User profile not found');
}

export async function updateProfile(userId, updateData) {
  const customer = await User.findById(userId);
  if (customer) {
    const allowed = ['name', 'phone', 'anniversary', 'birthday', 'addresses'];
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        customer[key] = updateData[key];
      }
    }
    await customer.save();
    return customer.toPublicJSON();
  }

  const admin = await AdminUser.findById(userId);
  if (admin) {
    if (updateData.name) admin.name = updateData.name;
    await admin.save();
    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    };
  }

  throw ApiError.notFound('User profile not found');
}

export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) throw ApiError.unauthorized('No refresh token');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const admin = await AdminUser.findById(decoded.id).select('+refreshTokenHash');
  if (admin) {
    if (!admin.refreshTokenHash) throw ApiError.unauthorized('Session expired');
    const isValid = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
    if (!isValid) throw ApiError.unauthorized('Invalid refresh token');
    const newAccessToken = signAccessToken(admin._id, admin.role);
    return { accessToken: newAccessToken };
  }

  const customer = await User.findById(decoded.id).select('+refreshTokenHash');
  if (customer && customer.isActive) {
    if (!customer.refreshTokenHash) throw ApiError.unauthorized('Session expired');
    const isValid = await bcrypt.compare(refreshToken, customer.refreshTokenHash);
    if (!isValid) throw ApiError.unauthorized('Invalid refresh token');
    const newAccessToken = signAccessToken(customer._id, 'PATRON');
    return { accessToken: newAccessToken };
  }

  throw ApiError.unauthorized('Session expired or invalid');
}

export async function logoutUser(userId) {
  await Promise.all([
    AdminUser.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } }),
    User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } }),
  ]);
}

export async function setup2FA(userId) {
  const user = await AdminUser.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const secret = speakeasy.generateSecret({ name: `House of Virasat (${user.email})` });

  await AdminUser.findByIdAndUpdate(userId, { totpSecret: secret.base32 });

  const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);
  return { secret: secret.base32, qrDataUrl };
}

export async function verify2FA(userId, totpCode) {
  const user = await AdminUser.findById(userId).select('+totpSecret');
  if (!user) throw ApiError.notFound('User not found');

  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: totpCode,
    window: 1,
  });

  if (!verified) throw ApiError.badRequest('Invalid 2FA code');

  await AdminUser.findByIdAndUpdate(userId, { totpEnabled: true });
  return { message: '2FA enabled successfully' };
}
