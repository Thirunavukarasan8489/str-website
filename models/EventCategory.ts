import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventCategory extends Document {
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventCategorySchema: Schema<IEventCategory> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const EventCategory: Model<IEventCategory> =
  mongoose.models.EventCategory ||
  mongoose.model<IEventCategory>('EventCategory', EventCategorySchema);

export default EventCategory;
