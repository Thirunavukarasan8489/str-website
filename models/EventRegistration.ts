import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventRegistration extends Document {
  bookingId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  fullName: string;
  email: string;
  phone: string;
  ticketType: string;
  quantity: number;
  totalPrice: string;
  notes?: string;
  status: 'Confirmed' | 'Attended' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    eventSlug: { type: String, required: true, index: true },
    eventTitle: { type: String, required: true },
    eventDate: { type: String, default: '' },
    eventTime: { type: String, default: '' },
    eventVenue: { type: String, default: '' },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    ticketType: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    totalPrice: { type: String, default: 'Free' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      default: 'Confirmed',
      enum: ['Confirmed', 'Attended', 'Cancelled'],
    },
  },
  {
    timestamps: true,
  }
);

const EventRegistration: Model<IEventRegistration> =
  mongoose.models.EventRegistration ||
  mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);

export default EventRegistration;
