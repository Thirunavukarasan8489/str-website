import React from 'react';
import type { Metadata } from 'next';
import MembershipTiers from '@/components/sections/MembershipTiers';
import SectionHeading from '@/components/shared/SectionHeading';
import SEOSchema from '@/components/shared/SEOSchema';
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo';
import { FAQS } from '@/lib/data';
import { CheckCircle2, ShieldCheck, Heart, Award, HelpCircle } from 'lucide-react';

export const revalidate = 60; // Refresh live membership data every 60 seconds

export const metadata: Metadata = {
  title: 'Membership Tiers | Scotland Tamils Raise',
  description:
    'Become a member of Scotland Tamils Raise. Compare Individual, Family, Student, and Lifetime Patron options.',
};

export default function MembershipPage() {
  const faqSchema = getFAQSchema(FAQS);
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Membership', item: '/membership' },
  ]);

  return (
    <>
      <SEOSchema schema={faqSchema} />
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Join Our Diaspora Family
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            STR Community <span className="gold-gradient-text">Membership</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Supporting language education, cultural galas, youth mentorship, and civic integration in Scotland.
          </p>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <MembershipTiers />

      {/* Membership FAQ Accordion */}
      <section className="py-20 bg-[#0A1440]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Common Questions"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about joining Scotland Tamils Raise."
          />

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#121F54] border border-[#1B3A6B] rounded-xl p-6 shadow-md hover:border-[#C9A227]/40 transition-colors"
              >
                <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-slate-300 pl-7 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
