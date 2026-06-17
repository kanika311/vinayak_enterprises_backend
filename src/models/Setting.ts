import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: unknown;
  group: string;
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: Schema.Types.Mixed,
    group: { type: String, default: 'general' },
  },
  { timestamps: true }
);

export default mongoose.model<ISetting>('Setting', settingSchema);
