import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/helpers';
import Admin from '../models/Admin';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Not authorized, no token', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
      permissions: string[];
    };
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return next(new AppError('Admin not found or inactive', 401));
    }
    req.user = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    };
    next();
  } catch {
    next(new AppError('Not authorized, token failed', 401));
  }
};

export const authorize = (...permissions: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }
    const hasPermission = permissions.some((p) => req.user!.permissions.includes(p));
    if (!hasPermission) {
      return next(new AppError('Forbidden: insufficient permissions', 403));
    }
    next();
  };
};
