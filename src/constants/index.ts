export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CONTENT_MANAGER: 'content_manager',
  SALES_EXECUTIVE: 'sales_executive',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  DASHBOARD: 'dashboard:read',
  PRODUCTS: 'products:manage',
  CATEGORIES: 'categories:manage',
  LEADS: 'leads:manage',
  RFQS: 'rfqs:manage',
  CATALOGUES: 'catalogues:manage',
  BLOGS: 'blogs:manage',
  SEO: 'seo:manage',
  TESTIMONIALS: 'testimonials:manage',
  CUSTOMERS: 'customers:manage',
  INQUIRIES: 'inquiries:manage',
  NEWSLETTER: 'newsletter:manage',
  MEDIA: 'media:manage',
  PAGES: 'pages:manage',
  ANALYTICS: 'analytics:read',
  SETTINGS: 'settings:manage',
  USERS: 'users:manage',
} as const;

export const ROLE_PERMISSIONS: Record<RoleType, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: Object.values(PERMISSIONS).filter((p) => p !== PERMISSIONS.USERS),
  [ROLES.CONTENT_MANAGER]: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.PRODUCTS,
    PERMISSIONS.CATEGORIES,
    PERMISSIONS.BLOGS,
    PERMISSIONS.SEO,
    PERMISSIONS.TESTIMONIALS,
    PERMISSIONS.MEDIA,
    PERMISSIONS.PAGES,
    PERMISSIONS.CATALOGUES,
  ],
  [ROLES.SALES_EXECUTIVE]: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.LEADS,
    PERMISSIONS.RFQS,
    PERMISSIONS.CUSTOMERS,
    PERMISSIONS.INQUIRIES,
    PERMISSIONS.ANALYTICS,
  ],
};

export const LEAD_SOURCES = [
  'contact_form',
  'request_quote',
  'catalogue_download',
  'product_enquiry',
  'whatsapp_click',
] as const;

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'] as const;

export const PRODUCT_STATUSES = ['draft', 'published'] as const;

export const CUSTOMER_TYPES = [
  'customer',
  'dealer',
  'distributor',
  'institution',
  'school',
  'college',
] as const;
