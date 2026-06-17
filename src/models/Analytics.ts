import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  type: 'page_view' | 'product_view' | 'visitor' | 'lead_source' | 'whatsapp_click';
  path?: string;
  product?: mongoose.Types.ObjectId;
  leadSource?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  country?: string;
  ipAddress?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    type: {
      type: String,
      enum: ['page_view', 'product_view', 'visitor', 'lead_source', 'whatsapp_click'],
      required: true,
    },
    path: String,
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    leadSource: String,
    device: { type: String, enum: ['desktop', 'mobile', 'tablet'] },
    browser: String,
    country: String,
    ipAddress: String,
    referrer: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
