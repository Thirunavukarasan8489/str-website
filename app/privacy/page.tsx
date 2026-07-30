import React from 'react';
import type { Metadata } from 'next';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Scotland Tamils Raise',
  description:
    'Read the official Privacy Policy of Scotland Tamils Raise regarding data collection, protection, and user rights in Scotland and the UK.',
};

export default function PrivacyPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Privacy Policy', item: '/privacy' },
  ]);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Legal & Governance
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            Privacy <span className="gold-gradient-text">Policy</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            How Scotland Tamils Raise collects, uses, and safeguards your personal data under UK GDPR and OSCR charity standards.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Highlight Card */}
          <div className="bg-[#121F54] border border-[#C9A227]/40 rounded-2xl p-6 sm:p-8 shadow-xl gold-glow flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1B3A6B] text-[#C9A227] flex items-center justify-center shrink-0 border border-[#C9A227]/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white mb-1">
                Your Privacy Matters to Us
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed">
                Scotland Tamils Raise is committed to protecting the personal information of our community members, volunteers, and event attendees across Scotland. We never sell your personal data to third parties.
              </p>
            </div>
          </div>

          {/* Detailed Policy Sections */}
          <div className="space-y-8 text-slate-200 text-sm sm:text-base leading-relaxed">
            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <FileText className="w-5 h-5 text-[#C9A227]" />
                1. Information We Collect
              </h2>
              <p>We may collect personal information when you interact with our website, join as a member, or register for events:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li><strong>Contact Details:</strong> Full name, email address, phone number, city, and UK postcode.</li>
                <li><strong>Membership Info:</strong> Selected tier (Individual, Family, Student, Lifetime) and areas of community interest.</li>
                <li><strong>Event Registrations:</strong> Attendee numbers, event ticket bookings, and special requirements.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and anonymous usage analytics to improve website speed.</li>
              </ul>
            </div>

            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Lock className="w-5 h-5 text-[#C9A227]" />
                2. How We Use Your Information
              </h2>
              <p>Your data is strictly used to serve our community purpose:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li>To manage community membership records and grant event ticket discounts.</li>
                <li>To send important announcements for Grand Pongal, Chithirai Vizha, and Tamil Academy classes.</li>
                <li>To process inquiries submitted through our contact forms.</li>
                <li>To ensure compliance with UK OSCR non-profit and charity regulations.</li>
              </ul>
            </div>

            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Eye className="w-5 h-5 text-[#C9A227]" />
                3. Your Rights Under UK GDPR
              </h2>
              <p>As a resident in the UK, you hold full rights regarding your data:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li><strong>Right of Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Right to Rectification:</strong> Ask us to correct any inaccurate or incomplete details.</li>
                <li><strong>Right to Erasure:</strong> Request the deletion of your personal membership data at any time.</li>
                <li><strong>Unsubscribe:</strong> Easily opt out of newsletter emails via the link in any update email.</li>
              </ul>
            </div>

            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A227]" />
                4. Contact Our Data Lead
              </h2>
              <p>
                If you have questions regarding this privacy policy or wish to exercise your data rights, please contact our General Secretary:
              </p>
              <p className="text-[#E8C468] font-bold">
                Email: secretary@scotlandtamilsraise.org
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
