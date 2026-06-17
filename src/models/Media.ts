import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  name: string;
  type: 'image' | 'video' | 'pdf' | 'document';
  url: string;
  publicId?: string;
  mimeType?: string;
  size?: number;
  alt?: string;
  folder?: string;
  uploadedBy?: mongoose.Types.ObjectId;
}

const mediaSchema = new Schema<IMedia>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['image', 'video', 'pdf', 'document'],
      required: true,
    },
    url: { type: String, required: true },
    publicId: String,
    mimeType: String,
    size: Number,
    alt: String,
    folder: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

export default mongoose.model<IMedia>('Media', mediaSchema);
