import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  category: string;
  albumSlug?: string;
  imageUrl: string;
  alt: string;
  caption: string;
  date: string;
  order: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema: Schema<IGalleryItem> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      default: 'Festivals',
      trim: true,
    },
    albumSlug: { type: String, trim: true, default: '' },
    imageUrl: { type: String, required: true, trim: true },
    alt: { type: String, default: 'Scotland Tamils Raise Gallery Photo' },
    caption: { type: String, default: '' },
    date: { type: String, default: '2026' },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItem;
