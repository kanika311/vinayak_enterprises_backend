import Product from '../models/Product';
import { AppError, generateSlug, getPagination, buildSort } from '../utils/helpers';
import { FilterQuery } from 'mongoose';

export const getProducts = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: FilterQuery<typeof Product> = {};

  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sort = buildSort(query.sortBy, query.order);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug, status: 'published' }).populate(
    'category',
    'name slug'
  );
  if (!product) throw new AppError('Product not found', 404);
  product.views += 1;
  await product.save();
  return product;
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id).populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const createProduct = async (data: Record<string, unknown>) => {
  if (!data.slug) data.slug = generateSlug(data.name as string);
  const existing = await Product.findOne({
    $or: [{ slug: data.slug }, { sku: data.sku }],
  });
  if (existing) throw new AppError('Product with this SKU or slug already exists', 400);
  return Product.create(data);
};

export const updateProduct = async (id: string, data: Record<string, unknown>) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};
