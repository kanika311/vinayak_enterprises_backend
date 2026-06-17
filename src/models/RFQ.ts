import mongoose, { Document, Schema } from 'mongoose';

export interface IRFQ extends Document {
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  product: mongoose.Types.ObjectId;
  quantity: number;
  budget?: string;
  requirements?: string;
  country?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
}

const rfqSchema = new Schema<IRFQ>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    companyName: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    budget: String,
    requirements: String,
    country: String,
    status: {
      type: String,
      enum: ['pending', 'quoted', 'accepted', 'rejected'],
      default: 'pending',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Admin' },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model<IRFQ>('RFQ', rfqSchema);
