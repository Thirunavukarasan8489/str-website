'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CloudinaryUploader from './CloudinaryUploader';
import { Save, Sparkles, CheckCircle2, AlertCircle, Loader2, RefreshCw, Eye, Home, SquarePen } from 'lucide-react';

import { notifyLiveContentUpdate } from '@/components/shared/LiveRouteRefresher';

interface HeroFormState {
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
}

export default function HeroManager() {
  const [formData, setFormData] = useState<HeroFormState>({
    badge: 'Bridging Tamil Heritage & Scottish Culture',
    title: 'Scotland Tamils',
    highlightTitle: 'Raise Together',
    subtitle:
      'Empowering the Tamil community across Edinburgh, Glasgow, Aberdeen, and Dundee through language learning, cultural galas, youth mentorship, and civic unity.',
    primaryCtaText: 'Join STR Membership',
    primaryCtaLink: '/membership/join',
    secondaryCtaText: 'Explore Events',
    secondaryCtaLink: '/events',
    familiesCount: '100+',
    yearsCount: '1+ Yrs',
    cardBadge: 'Flagship Event 2026',
    cardTitle: 'Grand Tamil Pongal Vizha',
    cardSubtitle: 'Edinburgh Assembly Rooms • Jan 17, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Scotland Tamils Raise Pongal Festival Celebration',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hero');
      const data = await res.json();
      if (res.ok && data.hero) {
        setFormData({
          badge: data.hero.badge || formData.badge,
          title: data.hero.title || formData.title,
          highlightTitle: data.hero.highlightTitle || formData.highlightTitle,
          subtitle: data.hero.subtitle || formData.subtitle,
          primaryCtaText: data.hero.primaryCtaText || formData.primaryCtaText,
          primaryCtaLink: data.hero.primaryCtaLink || formData.primaryCtaLink,
          secondaryCtaText: data.hero.secondaryCtaText || formData.secondaryCtaText,
          secondaryCtaLink: data.hero.secondaryCtaLink || formData.secondaryCtaLink,
          familiesCount: data.hero.familiesCount || formData.familiesCount,
          yearsCount: data.hero.yearsCount || formData.yearsCount,
          cardBadge: data.hero.cardBadge || formData.cardBadge,
          cardTitle: data.hero.cardTitle || formData.cardTitle,
          cardSubtitle: data.hero.cardSubtitle || formData.cardSubtitle,
          imageUrl: data.hero.imageUrl || formData.imageUrl,
          imageAlt: data.hero.imageAlt || formData.imageAlt,
        });
      }
    } catch (err) {
      console.error('Failed to load hero content', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: 'Hero Section updated and published live!' });
        notifyLiveContentUpdate();
        setTimeout(() => setStatusMessage(null), 5000);
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to save changes.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Network error saving changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
        <p className="text-sm text-slate-300">Loading Hero Section Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B3A6B] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Home Hero Section Editor</span>
            <SquarePen className="w-5 h-5 text-[#E8C468]" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Customize the homepage headline, subtext, CTA links, statistics, and main celebration photo.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] shadow-lg hover:brightness-110 disabled:opacity-70 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-900/30 border border-emerald-500/50 text-emerald-300'
              : 'bg-[#8B1A2B]/30 border border-[#8B1A2B] text-[#E8C468]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#8B1A2B] shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Headings & Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
                1. Headlines & Copy
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  placeholder="e.g. Bridging Tamil Heritage & Scottish Culture"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Title (Line 1)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                    placeholder="e.g. Scotland Tamils"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Highlight Title (Gold text)
                  </label>
                  <input
                    type="text"
                    value={formData.highlightTitle}
                    onChange={(e) => setFormData({ ...formData, highlightTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-[#E8C468] font-bold text-sm focus:outline-none focus:border-[#C9A227]"
                    placeholder="e.g. Raise Together"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Paragraph Subtitle
                </label>
                <textarea
                  rows={4}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  placeholder="Write an inviting overview for community members..."
                />
              </div>
            </div>

            {/* Buttons & Links */}
            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
                2. Action Buttons & Links
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.primaryCtaText}
                    onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Primary Button URL
                  </label>
                  <input
                    type="text"
                    value={formData.primaryCtaLink}
                    onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCtaText}
                    onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Secondary Button URL
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCtaLink}
                    onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>
            </div>

            {/* Statistics Bar */}
            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
                3. Metrics & Numbers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Tamil Families Count
                  </label>
                  <input
                    type="text"
                    value={formData.familiesCount}
                    onChange={(e) => setFormData({ ...formData, familiesCount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Legacy / Years
                  </label>
                  <input
                    type="text"
                    value={formData.yearsCount}
                    onChange={(e) => setFormData({ ...formData, yearsCount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Photo & Celebration Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
                4. Hero Celebration Photo (Cloudinary)
              </h3>

              <CloudinaryUploader
                currentImageUrl={formData.imageUrl}
                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Upload Hero Feature Photo"
                folder="str-website/hero"
              />

              <div className="pt-2 border-t border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-[#E8C468] uppercase tracking-wider">
                  Event Card Overlay Details
                </h4>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Card Pill Tag</label>
                  <input
                    type="text"
                    value={formData.cardBadge}
                    onChange={(e) => setFormData({ ...formData, cardBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Card Event Title</label>
                  <input
                    type="text"
                    value={formData.cardTitle}
                    onChange={(e) => setFormData({ ...formData, cardTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Card Venue & Date Subtitle</label>
                  <input
                    type="text"
                    value={formData.cardSubtitle}
                    onChange={(e) => setFormData({ ...formData, cardSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-[#0A1440] border border-[#C9A227]/40 rounded-2xl p-5 space-y-3 shadow-xl gold-glow">
              <div className="flex items-center justify-between text-xs text-[#E8C468] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Live Visual Preview
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Card Preview</span>
              </div>

              <div className="relative h-56 rounded-xl overflow-hidden border border-[#C9A227]/30 shadow-md">
                <Image src={formData.imageUrl} alt={formData.imageAlt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1440] via-[#0A1440]/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                  <span className="text-[9px] uppercase font-bold text-[#E8C468] bg-[#1B3A6B] px-2 py-0.5 rounded-full">
                    {formData.cardBadge}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-white mt-1 leading-tight">
                    {formData.cardTitle}
                  </h4>
                  <p className="text-[11px] text-slate-300">{formData.cardSubtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
