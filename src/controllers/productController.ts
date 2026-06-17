import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler, sendResponse, getParam } from '../utils/helpers';
import * as productService from '../services/productService';

export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await productService.getProducts(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const getProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productService.getProductById(getParam(req.params.id));
  sendResponse(res, 200, product);
});

export const getProductBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productService.getProductBySlug(getParam(req.params.slug));
  sendResponse(res, 200, product);
});

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productService.createProduct(req.body);
  sendResponse(res, 201, product, 'Product created');
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productService.updateProduct(getParam(req.params.id), req.body);
  sendResponse(res, 200, product, 'Product updated');
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  await productService.deleteProduct(getParam(req.params.id));
  sendResponse(res, 200, null, 'Product deleted');
});
