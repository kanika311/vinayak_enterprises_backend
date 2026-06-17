import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  company: string;
  email: string;
  phone?: string;
  type: 'customer' | 'dealer' | 'distributor' | 'institution' | 'school' | 'college';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  contactPerson?: string;
  notes?: string;
  isActive: boolean;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    type: {
      type: String,
      enum: ['customer', 'dealer', 'distributor', 'institution', 'school', 'college'],
      default: 'customer',
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    contactPerson: String,
    notes: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>('Customer', customerSchema);
