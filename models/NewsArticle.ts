import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsArticle extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsArticleSchema: Schema<INewsArticle> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    date: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
    author: { type: String, default: 'Editorial Team' },
    category: { type: String, default: 'Announcement' },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    },
    readTime: { type: String, default: '3 min read' },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const NewsArticle: Model<INewsArticle> =
  mongoose.models.NewsArticle || mongoose.model<INewsArticle>('NewsArticle', NewsArticleSchema);

export default NewsArticle;
