import mongoose, { Document, Schema } from 'mongoose';

export interface IInquiry extends Document {
  type: 'product_inquiry' | 'contact_request' | 'email_request';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  product?: mongoose.Types.ObjectId;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: mongoose.Types.ObjectId;
}

const inquirySchema = new Schema<IInquiry>(
  {
    type: {
      type: String,
      enum: ['product_inquiry', 'contact_request', 'email_request'],
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    company: String,
    subject: String,
    message: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'closed'],
      default: 'new',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

export default mongoose.model<IInquiry>('Inquiry', inquirySchema);
