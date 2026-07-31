import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMember extends Document {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  postcode: string;
  tier: string;
  interests: string[];
  termsAgreed: boolean;
  createdAt: Date;
}

const MemberSchema: Schema<IMember> = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postcode: { type: String, required: true, trim: true },
    tier: { type: String, required: true, trim: true },
    interests: { type: [String], required: true, default: [] },
    termsAgreed: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;
