import mongoose, { Document, Schema } from 'mongoose';

export interface ISEO extends Document {
  pagePath: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  schemaMarkup?: Record<string, unknown>;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

const seoSchema = new Schema<ISEO>(
  {
    pagePath: { type: String, required: true, unique: true },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    canonicalUrl: String,
    openGraph: {
      title: String,
      description: String,
      image: String,
      type: { type: String, default: 'website' },
    },
    schemaMarkup: Schema.Types.Mixed,
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISEO>('SEO', seoSchema);
