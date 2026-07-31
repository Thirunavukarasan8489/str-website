import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactMessage extends Document {
  fullName: string;
  email: string;
  city: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema: Schema<IContactMessage> = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;
