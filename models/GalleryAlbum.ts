import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryAlbum extends Document {
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  date: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryAlbumSchema: Schema<IGalleryAlbum> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, default: 'Festivals', trim: true },
    description: { type: String, default: '' },
    coverImage: { type: String, required: true, trim: true },
    date: { type: String, default: '2026' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const GalleryAlbum: Model<IGalleryAlbum> =
  mongoose.models.GalleryAlbum || mongoose.model<IGalleryAlbum>('GalleryAlbum', GalleryAlbumSchema);

export default GalleryAlbum;
