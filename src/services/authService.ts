import jwt, { type SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin';
import { ROLE_PERMISSIONS, ROLES } from '../constants';
import { AppError } from '../utils/helpers';
import { sendEmail } from '../config/email';

export const generateToken = (admin: {
  _id: string;
  email: string;
  role: string;
  permissions: string[];
}) => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  return jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role, permissions: admin.permissions },
    process.env.JWT_SECRET!,
    { expiresIn }
  );
};

export const loginAdmin = async (email: string, password: string) => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!admin.isActive) throw new AppError('Account is deactivated', 401);

  admin.lastLogin = new Date();
  await admin.save();

  const token = generateToken({
    _id: admin._id.toString(),
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
  });

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      avatar: admin.avatar,
    },
  };
};

export const forgotPassword = async (email: string) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new AppError('No account found with that email', 404);

  const resetToken = crypto.randomBytes(32).toString('hex');
  admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  admin.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
  await admin.save();

  const resetUrl = `${process.env.CLIENT_URL}/console/reset-password?token=${resetToken}`;
  await sendEmail({
    to: admin.email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  });

  return { message: 'Password reset email sent' };
};

export const resetPassword = async (token: string, password: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const admin = await Admin.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!admin) throw new AppError('Invalid or expired reset token', 400);

  admin.password = password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  await admin.save();

  return { message: 'Password reset successful' };
};

export const createAdmin = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const existing = await Admin.findOne({ email: data.email });
  if (existing) throw new AppError('Email already registered', 400);

  const role = data.role as keyof typeof ROLE_PERMISSIONS;
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.ADMIN];

  const admin = await Admin.create({ ...data, permissions });
  return admin;
};
