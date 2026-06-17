import Testimonial from '../models/Testimonial';
import Customer from '../models/Customer';
import Subscriber from '../models/Subscriber';
import Inquiry from '../models/Inquiry';
import Media from '../models/Media';
import Page from '../models/Page';
import Setting from '../models/Setting';
import SEO from '../models/SEO';
import Analytics from '../models/Analytics';
import { AppError, getPagination, buildSort } from '../utils/helpers';
import { uploadToCloudinary, getMediaType } from './cloudinaryService';

// Testimonials
export const getTestimonials = async (activeOnly = false) => {
  const filter = activeOnly ? { isActive: true } : {};
  return Testimonial.find(filter).sort({ order: 1 });
};

export const createTestimonial = async (data: Record<string, unknown>) => Testimonial.create(data);
export const updateTestimonial = async (id: string, data: Record<string, unknown>) => {
  const item = await Testimonial.findByIdAndUpdate(id, data, { new: true });
  if (!item) throw new AppError('Testimonial not found', 404);
  return item;
};
export const deleteTestimonial = async (id: string) => {
  const item = await Testimonial.findByIdAndDelete(id);
  if (!item) throw new AppError('Testimonial not found', 404);
  return item;
};

// Customers
export const getCustomers = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: Record<string, unknown> = {};
  if (query.type) filter.type = query.type;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { company: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }
  const sort = buildSort(query.sortBy, query.order);
  const [customers, total] = await Promise.all([
    Customer.find(filter).sort(sort).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);
  return { customers, total, page, limit, pages: Math.ceil(total / limit) };
};

export const createCustomer = async (data: Record<string, unknown>) => Customer.create(data);
export const updateCustomer = async (id: string, data: Record<string, unknown>) => {
  const item = await Customer.findByIdAndUpdate(id, data, { new: true });
  if (!item) throw new AppError('Customer not found', 404);
  return item;
};
export const deleteCustomer = async (id: string) => {
  const item = await Customer.findByIdAndDelete(id);
  if (!item) throw new AppError('Customer not found', 404);
  return item;
};

// Subscribers
export const getSubscribers = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const [subscribers, total] = await Promise.all([
    Subscriber.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Subscriber.countDocuments({ isActive: true }),
  ]);
  return { subscribers, total, page, limit, pages: Math.ceil(total / limit) };
};

export const subscribe = async (email: string, name?: string) => {
  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.isActive) throw new AppError('Already subscribed', 400);
    existing.isActive = true;
    await existing.save();
    return existing;
  }
  return Subscriber.create({ email, name });
};

export const exportSubscribersCSV = async () => {
  const subscribers = await Subscriber.find({ isActive: true }).select('email name subscribedAt');
  const header = 'Email,Name,Subscribed At\n';
  const rows = subscribers
    .map((s) => `${s.email},${s.name || ''},${s.subscribedAt.toISOString()}`)
    .join('\n');
  return header + rows;
};

// Inquiries
export const getInquiries = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: Record<string, unknown> = {};
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).populate('product', 'name').populate('assignedTo', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Inquiry.countDocuments(filter),
  ]);
  return { inquiries, total, page, limit, pages: Math.ceil(total / limit) };
};

export const createInquiry = async (data: Record<string, unknown>) => Inquiry.create(data);
export const updateInquiry = async (id: string, data: Record<string, unknown>) => {
  const item = await Inquiry.findByIdAndUpdate(id, data, { new: true });
  if (!item) throw new AppError('Inquiry not found', 404);
  return item;
};

// Media
export const getMedia = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: Record<string, unknown> = {};
  if (query.type) filter.type = query.type;
  if (query.folder) filter.folder = query.folder;
  const [media, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Media.countDocuments(filter),
  ]);
  return { media, total, page, limit, pages: Math.ceil(total / limit) };
};

export const uploadMedia = async (file: Express.Multer.File, adminId: string, folder?: string) => {
  const { url, publicId } = await uploadToCloudinary(file, folder || 'media');
  return Media.create({
    name: file.originalname,
    type: getMediaType(file.mimetype),
    url,
    publicId,
    mimeType: file.mimetype,
    size: file.size,
    folder,
    uploadedBy: adminId,
  });
};

export const deleteMedia = async (id: string) => {
  const item = await Media.findByIdAndDelete(id);
  if (!item) throw new AppError('Media not found', 404);
  return item;
};

// Pages (CMS)
export const getPages = async () => Page.find().sort({ title: 1 });
export const getPageBySlug = async (slug: string) => {
  const page = await Page.findOne({ slug, isPublished: true });
  if (!page) throw new AppError('Page not found', 404);
  return page;
};
export const upsertPage = async (slug: string, data: Record<string, unknown>) => {
  return Page.findOneAndUpdate({ slug }, { slug, ...data }, { new: true, upsert: true, runValidators: true });
};

// Settings
export const getSettings = async (group?: string) => {
  const filter = group ? { group } : {};
  const settings = await Setting.find(filter);
  return settings.reduce(
    (acc, s) => ({ ...acc, [s.key]: s.value }),
    {} as Record<string, unknown>
  );
};

export const updateSettings = async (settings: Record<string, unknown>, group = 'general') => {
  const ops = Object.entries(settings).map(([key, value]) =>
    Setting.findOneAndUpdate({ key }, { key, value, group }, { upsert: true, new: true })
  );
  await Promise.all(ops);
  return getSettings(group);
};

// SEO
export const getSEOEntries = async () => SEO.find().sort({ pagePath: 1 });
export const getSEOByPath = async (pagePath: string) => SEO.findOne({ pagePath });
export const upsertSEO = async (pagePath: string, data: Record<string, unknown>) => {
  return SEO.findOneAndUpdate({ pagePath }, { pagePath, ...data }, { new: true, upsert: true });
};

export const generateSitemap = async () => {
  const Product = (await import('../models/Product')).default;
  const Blog = (await import('../models/Blog')).default;
  const Category = (await import('../models/Category')).default;
  const baseUrl = process.env.CLIENT_URL || 'https://example.com';

  const [products, blogs, categories, pages] = await Promise.all([
    Product.find({ status: 'published' }).select('slug updatedAt').lean<{ slug: string; updatedAt?: Date }[]>(),
    Blog.find({ status: 'published' }).select('slug updatedAt').lean<{ slug: string; updatedAt?: Date }[]>(),
    Category.find({ isActive: true }).select('slug updatedAt').lean<{ slug: string; updatedAt?: Date }[]>(),
    Page.find({ isPublished: true }).select('slug updatedAt').lean<{ slug: string; updatedAt?: Date }[]>(),
  ]);

  type SitemapEntry = { loc: string; lastmod?: Date; priority?: string };
  const urls: SitemapEntry[] = [
    { loc: baseUrl, priority: '1.0' },
    ...categories.map((c) => ({ loc: `${baseUrl}/categories/${c.slug}`, lastmod: c.updatedAt })),
    ...products.map((p) => ({ loc: `${baseUrl}/products/${p.slug}`, lastmod: p.updatedAt })),
    ...blogs.map((b) => ({ loc: `${baseUrl}/blog/${b.slug}`, lastmod: b.updatedAt })),
    ...pages.map((p) => ({ loc: `${baseUrl}/${p.slug}`, lastmod: p.updatedAt })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    ${u.priority ? `<priority>${u.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;
  return xml;
};

export const generateRobotsTxt = async () => {
  const seoSettings = await getSettings('seo');
  const disallow = (seoSettings.disallowPaths as string[]) || [];
  return `User-agent: *
${disallow.map((p) => `Disallow: ${p}`).join('\n')}
Allow: /

Sitemap: ${process.env.CLIENT_URL}/sitemap.xml`;
};

// Analytics
export const trackEvent = async (data: Record<string, unknown>) => Analytics.create(data);

export const getAnalytics = async (query: Record<string, string>) => {
  const filter: Record<string, unknown> = {};
  if (query.type) filter.type = query.type;
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) (filter.createdAt as Record<string, Date>).$gte = new Date(query.startDate);
    if (query.endDate) (filter.createdAt as Record<string, Date>).$lte = new Date(query.endDate);
  }

  const [events, bySource, topProducts, byDevice] = await Promise.all([
    Analytics.countDocuments(filter),
    Analytics.aggregate([
      { $match: { ...filter, leadSource: { $exists: true } } },
      { $group: { _id: '$leadSource', count: { $sum: 1 } } },
    ]),
    Analytics.aggregate([
      { $match: { ...filter, type: 'product_view' } },
      { $group: { _id: '$product', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Analytics.aggregate([
      { $match: { ...filter, device: { $exists: true } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
    ]),
  ]);

  return { totalEvents: events, bySource, topProducts, byDevice };
};
