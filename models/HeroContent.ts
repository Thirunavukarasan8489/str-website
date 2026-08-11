import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeroContent extends Document {
  badge: string;
  title: string;
  highlightTitle: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  familiesCount: string;
  yearsCount: string;
  cardBadge: string;
  cardTitle: string;
  cardSubtitle: string;
  imageUrl: string;
  imageAlt: string;
  updatedAt: Date;
}

const HeroContentSchema: Schema<IHeroContent> = new Schema(
  {
    badge: { type: String, default: 'Bridging Tamil Heritage & Scottish Culture' },
    title: { type: String, default: 'Scotland Tamils' },
    highlightTitle: { type: String, default: 'Raise Together' },
    subtitle: {
      type: String,
      default:
        'Empowering the Tamil community across Edinburgh, Glasgow, Aberdeen, and Dundee through language learning, cultural galas, youth mentorship, and civic unity.',
    },
    primaryCtaText: { type: String, default: 'Join STR Membership' },
    primaryCtaLink: { type: String, default: '/membership/join' },
    secondaryCtaText: { type: String, default: 'Explore Events' },
    secondaryCtaLink: { type: String, default: '/events' },
    familiesCount: { type: String, default: '100+' },
    yearsCount: { type: String, default: '1+ Yrs' },
    cardBadge: { type: String, default: 'Flagship Event 2026' },
    cardTitle: { type: String, default: 'Grand Tamil Pongal Vizha' },
    cardSubtitle: { type: String, default: 'Edinburgh Assembly Rooms • Jan 17, 2026' },
    imageUrl: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
    },
    imageAlt: {
      type: String,
      default: 'Scotland Tamils Raise Pongal Festival Celebration',
    },
  },
  {
    timestamps: true,
  }
);

const HeroContent: Model<IHeroContent> =
  mongoose.models.HeroContent || mongoose.model<IHeroContent>('HeroContent', HeroContentSchema);

export default HeroContent;
