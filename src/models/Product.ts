import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: { key: string; value: string }[];
  images: { url: string; publicId?: string; alt?: string }[];
  videos: { url: string; publicId?: string; title?: string }[];
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords: string[];
  faq: { question: string; answer: string }[];
  brochure?: { url: string; publicId?: string };
  status: 'draft' | 'published';
  views: number;
  enquiryCount: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: String,
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    features: [String],
    specifications: [{ key: String, value: String }],
    images: [{ url: String, publicId: String, alt: String }],
    videos: [{ url: String, publicId: String, title: String }],
    seoTitle: String,
    seoDescription: String,
    metaKeywords: [String],
    faq: [{ question: String, answer: String }],
    brochure: { url: String, publicId: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    views: { type: Number, default: 0 },
    enquiryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', shortDescription: 'text', sku: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);
