import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryCategory extends Document {
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryCategorySchema: Schema<IGalleryCategory> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory ||
  mongoose.model<IGalleryCategory>('GalleryCategory', GalleryCategorySchema);

export default GalleryCategory;
