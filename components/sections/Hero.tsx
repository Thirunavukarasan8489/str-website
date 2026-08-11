"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Heart,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import CTAButton from "@/components/shared/CTAButton";
import { HeroData } from "@/types";

const DEFAULT_HERO_VALUES: HeroData = {
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
};

interface HeroProps {
  data?: HeroData;
}

export default function Hero({ data = DEFAULT_HERO_VALUES }: HeroProps) {
  const badge = data.badge || DEFAULT_HERO_VALUES.badge;
  const title = data.title || DEFAULT_HERO_VALUES.title;
  const highlightTitle = data.highlightTitle || DEFAULT_HERO_VALUES.highlightTitle;
  const subtitle = data.subtitle || DEFAULT_HERO_VALUES.subtitle;
  const primaryCtaText = data.primaryCtaText || DEFAULT_HERO_VALUES.primaryCtaText;
  const primaryCtaLink = data.primaryCtaLink || DEFAULT_HERO_VALUES.primaryCtaLink;
  const secondaryCtaText = data.secondaryCtaText || DEFAULT_HERO_VALUES.secondaryCtaText;
  const secondaryCtaLink = data.secondaryCtaLink || DEFAULT_HERO_VALUES.secondaryCtaLink;
  const familiesCount = data.familiesCount || DEFAULT_HERO_VALUES.familiesCount;
  const yearsCount = data.yearsCount || DEFAULT_HERO_VALUES.yearsCount;
  const cardBadge = data.cardBadge || DEFAULT_HERO_VALUES.cardBadge;
  const cardTitle = data.cardTitle || DEFAULT_HERO_VALUES.cardTitle;
  const cardSubtitle = data.cardSubtitle || DEFAULT_HERO_VALUES.cardSubtitle;
  const imageUrl = data.imageUrl || DEFAULT_HERO_VALUES.imageUrl;
  const imageAlt = data.imageAlt || DEFAULT_HERO_VALUES.imageAlt;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 overflow-hidden tartan-pattern">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1B3A6B]/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#C9A227]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B3A6B]/80 border border-[#C9A227]/40 shadow-sm backdrop-blur-sm">
              <Award className="w-4 h-4 text-[#C9A227]" />
              <span className="text-xs md:text-sm font-semibold text-[#E8C468]">
                {badge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15]">
              {title} <br className="hidden sm:inline" />
              <span className="gold-gradient-text">{highlightTitle}</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <CTAButton
                href={primaryCtaLink}
                variant="primary"
                className="w-full sm:w-auto"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </CTAButton>
              <CTAButton
                href={secondaryCtaLink}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2 text-[#C9A227]" />
                <span>{secondaryCtaText}</span>
              </CTAButton>
            </div>

            {/* Key Statistics Bar */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white">
                  {familiesCount}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Tamil Families
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white">
                  {yearsCount}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Community Legacy
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card Frame */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#C9A227]/40 shadow-2xl gold-glow group">
                <div className="relative h-[380px] sm:h-[420px] w-full">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1440] via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A1440] via-[#0A1440]/90 to-transparent">
                  <span className="inline-block text-xs uppercase tracking-wider font-semibold text-[#E8C468] bg-[#1B3A6B] px-3 py-1 rounded-full mb-2 border border-[#C9A227]/30">
                    {cardBadge}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {cardTitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {cardSubtitle}
                  </p>
                </div>
              </div>

              {/* Floating Badge Overlay */}
              <div className="absolute -bottom-6 -left-6 bg-[#121F54] border border-[#C9A227]/50 rounded-xl p-4 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B1A2B] flex items-center justify-center text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Registered Non-Profit
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    OSCR Charity Compliant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
