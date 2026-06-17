import mongoose, { Document, Schema } from 'mongoose';

export interface IDownload extends Document {
  catalogue?: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  visitorName?: string;
  visitorEmail?: string;
  visitorCompany?: string;
  visitorPhone?: string;
  visitorCountry?: string;
  productInterest?: string;
  ipAddress?: string;
  userAgent?: string;
}

const downloadSchema = new Schema<IDownload>(
  {
    catalogue: { type: Schema.Types.ObjectId, ref: 'Catalogue' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    visitorName: String,
    visitorEmail: String,
    visitorCompany: String,
    visitorPhone: String,
    visitorCountry: String,
    productInterest: String,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model<IDownload>('Download', downloadSchema);
