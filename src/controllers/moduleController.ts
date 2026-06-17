import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler, sendResponse, getParam } from '../utils/helpers';
import * as categoryService from '../services/categoryService';
import * as leadService from '../services/leadService';
import * as rfqService from '../services/rfqService';
import * as blogService from '../services/blogService';
import * as catalogueService from '../services/catalogueService';
import * as miscService from '../services/miscService';

// Categories
export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const categories = await categoryService.getCategories(req.query.active === 'true');
  sendResponse(res, 200, categories);
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  sendResponse(res, 201, category);
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await categoryService.updateCategory(getParam(req.params.id), req.body);
  sendResponse(res, 200, category);
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await categoryService.deleteCategory(getParam(req.params.id));
  sendResponse(res, 200, null, 'Category deleted');
});

// Leads
export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await leadService.getLeads(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadService.createLead(req.body);
  sendResponse(res, 201, lead, 'Lead created');
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadService.updateLead(getParam(req.params.id), req.body, req.user?.id);
  sendResponse(res, 200, lead);
});

export const addLeadNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadService.addLeadNote(getParam(req.params.id), req.body.text, req.user!.id);
  sendResponse(res, 200, lead);
});

export const assignLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadService.assignLead(getParam(req.params.id), req.body.assignedTo, req.user!.id);
  sendResponse(res, 200, lead);
});

// RFQs
export const getRFQs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await rfqService.getRFQs(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const createRFQ = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rfq = await rfqService.createRFQ(req.body);
  sendResponse(res, 201, rfq);
});

export const updateRFQ = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rfq = await rfqService.updateRFQ(getParam(req.params.id), req.body);
  sendResponse(res, 200, rfq);
});

export const getRFQReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const report = await rfqService.getRFQReport(req.query as Record<string, string>);
  sendResponse(res, 200, report);
});

// Blogs
export const getBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await blogService.getBlogs(req.query as Record<string, string>, !req.user);
  sendResponse(res, 200, result);
});

export const getBlogBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const blog = await blogService.getBlogBySlug(getParam(req.params.slug));
  sendResponse(res, 200, blog);
});

export const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const blog = await blogService.createBlog({ ...req.body, author: req.user!.id });
  sendResponse(res, 201, blog);
});

export const updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const blog = await blogService.updateBlog(getParam(req.params.id), req.body);
  sendResponse(res, 200, blog);
});

export const deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  await blogService.deleteBlog(getParam(req.params.id));
  sendResponse(res, 200, null, 'Blog deleted');
});

// Catalogues
export const getCatalogues = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await catalogueService.getCatalogues(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const createCatalogue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const catalogue = await catalogueService.createCatalogue(req.body);
  sendResponse(res, 201, catalogue);
});

export const trackDownload = asyncHandler(async (req: AuthRequest, res: Response) => {
  const catalogue = await catalogueService.trackDownload(getParam(req.params.id), req.body);
  sendResponse(res, 200, catalogue);
});

export const deleteCatalogue = asyncHandler(async (req: AuthRequest, res: Response) => {
  await catalogueService.deleteCatalogue(getParam(req.params.id));
  sendResponse(res, 200, null, 'Catalogue deleted');
});

// Testimonials
export const getTestimonials = asyncHandler(async (req: AuthRequest, res: Response) => {
  const items = await miscService.getTestimonials(!req.user);
  sendResponse(res, 200, items);
});

export const createTestimonial = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await miscService.createTestimonial(req.body);
  sendResponse(res, 201, item);
});

export const updateTestimonial = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await miscService.updateTestimonial(getParam(req.params.id), req.body);
  sendResponse(res, 200, item);
});

export const deleteTestimonial = asyncHandler(async (req: AuthRequest, res: Response) => {
  await miscService.deleteTestimonial(getParam(req.params.id));
  sendResponse(res, 200, null, 'Deleted');
});

// Customers
export const getCustomers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await miscService.getCustomers(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const createCustomer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await miscService.createCustomer(req.body);
  sendResponse(res, 201, item);
});

export const updateCustomer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await miscService.updateCustomer(getParam(req.params.id), req.body);
  sendResponse(res, 200, item);
});

export const deleteCustomer = asyncHandler(async (req: AuthRequest, res: Response) => {
  await miscService.deleteCustomer(getParam(req.params.id));
  sendResponse(res, 200, null, 'Deleted');
});

// Subscribers
export const getSubscribers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await miscService.getSubscribers(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const subscribe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subscriber = await miscService.subscribe(req.body.email, req.body.name);
  sendResponse(res, 201, subscriber);
});

export const exportSubscribers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const csv = await miscService.exportSubscribersCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
});

// Inquiries
export const getInquiries = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await miscService.getInquiries(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const createInquiry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const inquiry = await miscService.createInquiry(req.body);
  sendResponse(res, 201, inquiry);
});

export const updateInquiry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const inquiry = await miscService.updateInquiry(getParam(req.params.id), req.body);
  sendResponse(res, 200, inquiry);
});

// Media
export const getMedia = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await miscService.getMedia(req.query as Record<string, string>);
  sendResponse(res, 200, result);
});

export const uploadMedia = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) throw new Error('No file uploaded');
  const media = await miscService.uploadMedia(req.file, req.user!.id, req.body.folder);
  sendResponse(res, 201, media);
});

export const deleteMedia = asyncHandler(async (req: AuthRequest, res: Response) => {
  await miscService.deleteMedia(getParam(req.params.id));
  sendResponse(res, 200, null, 'Deleted');
});

// Pages CMS
export const getPages = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const pages = await miscService.getPages();
  sendResponse(res, 200, pages);
});

export const getPageBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = await miscService.getPageBySlug(getParam(req.params.slug));
  sendResponse(res, 200, page);
});

export const upsertPage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = await miscService.upsertPage(getParam(req.params.slug), req.body);
  sendResponse(res, 200, page);
});

// Settings
export const getSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const settings = await miscService.getSettings(req.query.group as string);
  sendResponse(res, 200, settings);
});

export const updateSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const settings = await miscService.updateSettings(req.body, req.query.group as string);
  sendResponse(res, 200, settings);
});

// SEO
export const getSEOEntries = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const entries = await miscService.getSEOEntries();
  sendResponse(res, 200, entries);
});

export const upsertSEO = asyncHandler(async (req: AuthRequest, res: Response) => {
  const seo = await miscService.upsertSEO(getParam(req.params.path), req.body);
  sendResponse(res, 200, seo);
});

export const getSitemap = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const xml = await miscService.generateSitemap();
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

export const getRobotsTxt = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const txt = await miscService.generateRobotsTxt();
  res.setHeader('Content-Type', 'text/plain');
  res.send(txt);
});

// Analytics
export const trackEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  await miscService.trackEvent(req.body);
  sendResponse(res, 201, null, 'Event tracked');
});

export const getAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await miscService.getAnalytics(req.query as Record<string, string>);
  sendResponse(res, 200, data);
});
