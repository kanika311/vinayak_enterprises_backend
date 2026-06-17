import Product from '../models/Product';
import Lead from '../models/Lead';
import RFQ from '../models/RFQ';
import Analytics from '../models/Analytics';
import Blog from '../models/Blog';
import Download from '../models/Download';
import { getPagination } from '../utils/helpers';

export const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalProducts,
    totalLeads,
    totalRFQs,
    totalVisitors,
    monthlyLeads,
    blogViews,
    catalogueDownloads,
    topProducts,
    leadsPerMonth,
    trafficOverview,
    enquiryTrends,
    visitorDevices,
  ] = await Promise.all([
    Product.countDocuments({ status: 'published' }),
    Lead.countDocuments(),
    RFQ.countDocuments(),
    Analytics.countDocuments({ type: 'visitor' }),
    Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    Download.countDocuments(),
    Product.find({ status: 'published' })
      .sort({ enquiryCount: -1, views: -1 })
      .limit(5)
      .select('name sku views enquiryCount images'),
    Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Analytics.aggregate([
      { $match: { type: 'page_view', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Analytics.aggregate([
      { $match: { type: 'visitor', device: { $exists: true } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
    ]),
  ]);

  return {
    stats: {
      totalProducts,
      totalLeads,
      totalRFQs,
      totalVisitors,
      monthlyLeads,
      blogViews: blogViews[0]?.total || 0,
      catalogueDownloads,
    },
    topProducts,
    charts: {
      leadsPerMonth,
      trafficOverview,
      enquiryTrends,
      visitorDevices,
    },
  };
};
