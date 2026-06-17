import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: { url: string; publicId?: string };
  category?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published';
  views: number;
  publishedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    featuredImage: { url: String, publicId: String },
    category: String,
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    seoTitle: String,
    seoDescription: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    views: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', content: 'text' });

export default mongoose.model<IBlog>('Blog', blogSchema);
