import mongoose, { Document, Schema } from 'mongoose';

export interface IPageSection {
  key: string;
  title?: string;
  content: unknown;
  order: number;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  sections: IPageSection[];
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
}

const pageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sections: [
      {
        key: String,
        title: String,
        content: Schema.Types.Mixed,
        order: Number,
      },
    ],
    seoTitle: String,
    seoDescription: String,
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPage>('Page', pageSchema);
