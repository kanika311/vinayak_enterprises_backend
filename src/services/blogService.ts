import Blog from '../models/Blog';
import { AppError, generateSlug, getPagination, buildSort } from '../utils/helpers';

export const getBlogs = async (query: Record<string, string>, publicOnly = false) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: Record<string, unknown> = {};
  if (publicOnly) filter.status = 'published';
  else if (query.status) filter.status = query.status;
  if (query.search) filter.$text = { $search: query.search };

  const sort = buildSort(query.sortBy || 'publishedAt', query.order);
  const [blogs, total] = await Promise.all([
    Blog.find(filter).populate('author', 'name').sort(sort).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);
  return { blogs, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await Blog.findOne({ slug, status: 'published' }).populate('author', 'name');
  if (!blog) throw new AppError('Blog not found', 404);
  blog.views += 1;
  await blog.save();
  return blog;
};

export const createBlog = async (data: Record<string, unknown>) => {
  if (!data.slug) data.slug = generateSlug(data.title as string);
  return Blog.create(data);
};

export const updateBlog = async (id: string, data: Record<string, unknown>) => {
  const blog = await Blog.findByIdAndUpdate(id, data, { new: true }).populate('author', 'name');
  if (!blog) throw new AppError('Blog not found', 404);
  return blog;
};

export const deleteBlog = async (id: string) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new AppError('Blog not found', 404);
  return blog;
};
