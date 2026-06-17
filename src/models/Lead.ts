import mongoose, { Document, Schema } from 'mongoose';

export interface ILeadNote {
  text: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ILeadTimeline {
  action: string;
  description: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ILead extends Document {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  productInterested?: string;
  message?: string;
  leadSource: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: mongoose.Types.ObjectId;
  notes: ILeadNote[];
  timeline: ILeadTimeline[];
  product?: mongoose.Types.ObjectId;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    company: String,
    email: { type: String, required: true, lowercase: true },
    phone: String,
    country: String,
    productInterested: String,
    message: String,
    leadSource: {
      type: String,
      enum: ['contact_form', 'request_quote', 'catalogue_download', 'product_enquiry', 'whatsapp_click'],
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
      default: 'new',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Admin' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    notes: [
      {
        text: String,
        createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        action: String,
        description: String,
        createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ILead>('Lead', leadSchema);
