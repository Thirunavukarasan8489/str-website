export interface EventItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  date: string; // ISO date string or formatted date
  time: string;
  location: string;
  city: string; // Edinburgh, Glasgow, Aberdeen, etc.
  venue: string;
  category: 'Festival' | 'Cultural' | 'Youth' | 'Community' | 'Workshop';
  image: string;
  isFeatured?: boolean;
  isPast?: boolean;
  ticketLink?: string;
  registrationOpen: boolean;
  price?: string;
  agenda?: { time: string; activity: string }[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: 'Press Release' | 'Community Story' | 'Culture' | 'Announcement';
  image: string;
  readTime: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Culture' | 'Festivals' | 'Youth' | 'Community' | 'Sports';
  imageUrl: string;
  alt: string;
  caption: string;
  date: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  city: string;
  email?: string;
  linkedin?: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  city: string;
  subject: string;
  message: string;
}

export interface MembershipFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  postcode: string;
  tier: string;
  interests: string[];
  termsAgreed: boolean;
}
