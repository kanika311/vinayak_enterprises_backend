import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  company: string;
  designation?: string;
  review: string;
  image?: { url: string; publicId?: string };
  rating: number;
  isActive: boolean;
  order: number;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    designation: String,
    review: { type: String, required: true },
    image: { url: String, publicId: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
