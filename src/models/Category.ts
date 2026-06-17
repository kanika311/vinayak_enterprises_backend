import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: mongoose.Types.ObjectId;
  subcategories: { name: string; slug: string }[];
  isActive: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategories: [
      {
        name: { type: String, required: true },
        slug: { type: String, required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);
