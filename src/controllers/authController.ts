import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler, sendResponse, getParam } from '../utils/helpers';
import * as authService from '../services/authService';
import * as dashboardService from '../services/dashboardService';
import Admin from '../models/Admin';

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.loginAdmin(req.body.email, req.body.password);
  sendResponse(res, 200, result, 'Login successful');
});

export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  sendResponse(res, 200, result);
});

export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  sendResponse(res, 200, result);
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await Admin.findById(req.user!.id).select('-password');
  sendResponse(res, 200, {
    id: admin?._id,
    name: admin?.name,
    email: admin?.email,
    role: admin?.role,
    permissions: admin?.permissions,
    avatar: admin?.avatar,
  });
});

export const createAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await authService.createAdmin(req.body);
  sendResponse(res, 201, admin, 'Admin created');
});

export const getAdmins = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
  sendResponse(res, 200, admins);
});

export const updateAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await Admin.findByIdAndUpdate(getParam(req.params.id), req.body, { new: true }).select('-password');
  sendResponse(res, 200, admin);
});

export const getDashboard = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const data = await dashboardService.getDashboardStats();
  sendResponse(res, 200, data);
});
