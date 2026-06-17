import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  slug: string;
  permissions: string[];
  description?: string;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<IRole>('Role', roleSchema);
