import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventItem extends Document {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  date: string;
  time: string;
  location: string;
  city: string;
  venue: string;
  category: string;
  image: string;
  isFeatured: boolean;
  isPast: boolean;
  registrationOpen: boolean;
  ticketLink?: string;
  price?: string;
  ticketTiers?: { name: string; price: string }[];
  agenda?: { time: string; activity: string }[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AgendaSchema = new Schema(
  {
    time: { type: String, required: true },
    activity: { type: String, required: true },
  },
  { _id: false }
);

const TicketTierSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

const EventItemSchema = new Schema<IEventItem>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, default: '' },
    location: { type: String, default: '' },
    city: { type: String, required: true, default: 'Edinburgh' },
    venue: { type: String, default: '' },
    category: { type: String, default: 'General' },
    image: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isPast: { type: Boolean, default: false },
    registrationOpen: { type: Boolean, default: true },
    ticketLink: { type: String, default: '' },
    price: { type: String, default: '' },
    ticketTiers: { type: [TicketTierSchema], default: [] },
    agenda: { type: [AgendaSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const EventItem: Model<IEventItem> =
  mongoose.models.EventItem || mongoose.model<IEventItem>('EventItem', EventItemSchema);

export default EventItem;
