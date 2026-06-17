import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';
import { upload } from '../middleware/upload';
import { PERMISSIONS } from '../constants';
import {
  loginValidation,
  productValidation,
  leadValidation,
  rfqValidation,
  blogValidation,
} from '../validators';
import * as authCtrl from '../controllers/authController';
import * as productCtrl from '../controllers/productController';
import * as moduleCtrl from '../controllers/moduleController';

const router = Router();

// Auth
router.post('/auth/login', authLimiter, loginValidation, validate, authCtrl.login);
router.post('/auth/forgot-password', authCtrl.forgotPassword);
router.post('/auth/reset-password', authCtrl.resetPassword);
router.get('/auth/me', protect, authCtrl.getMe);
router.get('/admins', protect, authorize(PERMISSIONS.USERS), authCtrl.getAdmins);
router.post('/admins', protect, authorize(PERMISSIONS.USERS), authCtrl.createAdmin);
router.put('/admins/:id', protect, authorize(PERMISSIONS.USERS), authCtrl.updateAdmin);

// Dashboard
router.get('/dashboard', protect, authorize(PERMISSIONS.DASHBOARD), authCtrl.getDashboard);

// Products - Public
router.get('/products', productCtrl.getProducts);
router.get('/products/slug/:slug', productCtrl.getProductBySlug);

// Products - Admin
router.get('/products/:id', protect, authorize(PERMISSIONS.PRODUCTS), productCtrl.getProduct);
router.post('/products', protect, authorize(PERMISSIONS.PRODUCTS), productValidation, validate, productCtrl.createProduct);
router.put('/products/:id', protect, authorize(PERMISSIONS.PRODUCTS), productCtrl.updateProduct);
router.delete('/products/:id', protect, authorize(PERMISSIONS.PRODUCTS), productCtrl.deleteProduct);

// Categories
router.get('/categories', moduleCtrl.getCategories);
router.post('/categories', protect, authorize(PERMISSIONS.CATEGORIES), moduleCtrl.createCategory);
router.put('/categories/:id', protect, authorize(PERMISSIONS.CATEGORIES), moduleCtrl.updateCategory);
router.delete('/categories/:id', protect, authorize(PERMISSIONS.CATEGORIES), moduleCtrl.deleteCategory);

// Leads
router.post('/leads', leadValidation, validate, moduleCtrl.createLead);
router.get('/leads', protect, authorize(PERMISSIONS.LEADS), moduleCtrl.getLeads);
router.put('/leads/:id', protect, authorize(PERMISSIONS.LEADS), moduleCtrl.updateLead);
router.post('/leads/:id/notes', protect, authorize(PERMISSIONS.LEADS), moduleCtrl.addLeadNote);
router.put('/leads/:id/assign', protect, authorize(PERMISSIONS.LEADS), moduleCtrl.assignLead);

// RFQs
router.post('/rfqs', rfqValidation, validate, moduleCtrl.createRFQ);
router.get('/rfqs', protect, authorize(PERMISSIONS.RFQS), moduleCtrl.getRFQs);
router.put('/rfqs/:id', protect, authorize(PERMISSIONS.RFQS), moduleCtrl.updateRFQ);
router.get('/rfqs/report', protect, authorize(PERMISSIONS.RFQS), moduleCtrl.getRFQReport);

// Blogs
router.get('/blogs', moduleCtrl.getBlogs);
router.get('/blogs/slug/:slug', moduleCtrl.getBlogBySlug);
router.post('/blogs', protect, authorize(PERMISSIONS.BLOGS), blogValidation, validate, moduleCtrl.createBlog);
router.put('/blogs/:id', protect, authorize(PERMISSIONS.BLOGS), moduleCtrl.updateBlog);
router.delete('/blogs/:id', protect, authorize(PERMISSIONS.BLOGS), moduleCtrl.deleteBlog);

// Catalogues
router.get('/catalogues', moduleCtrl.getCatalogues);
router.post('/catalogues', protect, authorize(PERMISSIONS.CATALOGUES), moduleCtrl.createCatalogue);
router.post('/catalogues/:id/download', moduleCtrl.trackDownload);
router.delete('/catalogues/:id', protect, authorize(PERMISSIONS.CATALOGUES), moduleCtrl.deleteCatalogue);

// Testimonials
router.get('/testimonials', moduleCtrl.getTestimonials);
router.post('/testimonials', protect, authorize(PERMISSIONS.TESTIMONIALS), moduleCtrl.createTestimonial);
router.put('/testimonials/:id', protect, authorize(PERMISSIONS.TESTIMONIALS), moduleCtrl.updateTestimonial);
router.delete('/testimonials/:id', protect, authorize(PERMISSIONS.TESTIMONIALS), moduleCtrl.deleteTestimonial);

// Customers
router.get('/customers', protect, authorize(PERMISSIONS.CUSTOMERS), moduleCtrl.getCustomers);
router.post('/customers', protect, authorize(PERMISSIONS.CUSTOMERS), moduleCtrl.createCustomer);
router.put('/customers/:id', protect, authorize(PERMISSIONS.CUSTOMERS), moduleCtrl.updateCustomer);
router.delete('/customers/:id', protect, authorize(PERMISSIONS.CUSTOMERS), moduleCtrl.deleteCustomer);

// Newsletter
router.post('/subscribers', moduleCtrl.subscribe);
router.get('/subscribers', protect, authorize(PERMISSIONS.NEWSLETTER), moduleCtrl.getSubscribers);
router.get('/subscribers/export', protect, authorize(PERMISSIONS.NEWSLETTER), moduleCtrl.exportSubscribers);

// Inquiries
router.post('/inquiries', moduleCtrl.createInquiry);
router.get('/inquiries', protect, authorize(PERMISSIONS.INQUIRIES), moduleCtrl.getInquiries);
router.put('/inquiries/:id', protect, authorize(PERMISSIONS.INQUIRIES), moduleCtrl.updateInquiry);

// Media
router.get('/media', protect, authorize(PERMISSIONS.MEDIA), moduleCtrl.getMedia);
router.post('/media/upload', protect, authorize(PERMISSIONS.MEDIA), upload.single('file'), moduleCtrl.uploadMedia);
router.delete('/media/:id', protect, authorize(PERMISSIONS.MEDIA), moduleCtrl.deleteMedia);

// Pages CMS
router.get('/pages', protect, authorize(PERMISSIONS.PAGES), moduleCtrl.getPages);
router.get('/pages/:slug', moduleCtrl.getPageBySlug);
router.put('/pages/:slug', protect, authorize(PERMISSIONS.PAGES), moduleCtrl.upsertPage);

// Settings
router.get('/settings', protect, authorize(PERMISSIONS.SETTINGS), moduleCtrl.getSettings);
router.put('/settings', protect, authorize(PERMISSIONS.SETTINGS), moduleCtrl.updateSettings);

// SEO
router.get('/seo', protect, authorize(PERMISSIONS.SEO), moduleCtrl.getSEOEntries);
router.put('/seo/:path(*)', protect, authorize(PERMISSIONS.SEO), moduleCtrl.upsertSEO);
router.get('/sitemap.xml', moduleCtrl.getSitemap);
router.get('/robots.txt', moduleCtrl.getRobotsTxt);

// Analytics
router.post('/analytics/track', moduleCtrl.trackEvent);
router.get('/analytics', protect, authorize(PERMISSIONS.ANALYTICS), moduleCtrl.getAnalytics);

export default router;
