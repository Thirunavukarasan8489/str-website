import React from 'react';
import type { Metadata } from 'next';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { ShieldAlert, BookOpen, Users, Award, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Scotland Tamils Raise',
  description:
    'Read the Terms of Service and Community Code of Conduct for Scotland Tamils Raise organization, events, and online portals.',
};

export default function TermsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Terms of Service', item: '/terms' },
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
            Terms of <span className="gold-gradient-text">Service</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Community guidelines, event ticket terms, and code of conduct governing participation in Scotland Tamils Raise activities.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Highlight Card */}
          <div className="bg-[#121F54] border border-[#C9A227]/40 rounded-2xl p-6 sm:p-8 shadow-xl gold-glow flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1B3A6B] text-[#C9A227] flex items-center justify-center shrink-0 border border-[#C9A227]/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white mb-1">
                Community Code of Conduct
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed">
                Scotland Tamils Raise is built on mutual respect, cultural heritage, inclusivity, and family unity. All members and event guests agree to adhere to these values.
              </p>
            </div>
          </div>

          {/* Detailed Terms Sections */}
          <div className="space-y-8 text-slate-200 text-sm sm:text-base leading-relaxed">
            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Users className="w-5 h-5 text-[#C9A227]" />
                1. Membership Terms & Voting Rights
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li>Membership is open to individuals and families residing in or connected to Scotland.</li>
                <li>Annual memberships run for 12 months from the date of registration.</li>
                <li>Voting rights at the Annual General Meeting (AGM) apply to active Individual and Family tier members.</li>
                <li>The Executive Committee reserves the right to revoke membership in cases of code of conduct violations.</li>
              </ul>
            </div>

            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Award className="w-5 h-5 text-[#C9A227]" />
                2. Event Ticket Policies & Refunds
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li>Tickets for Grand Pongal Vizha, Chithirai Gala, and workshops are non-transferable unless authorized by the team.</li>
                <li>Refund requests submitted at least 7 days prior to an event will be processed minus administrative fees.</li>
                <li>Organizers reserve the right to modify event agendas or venues due to Scottish weather or safety considerations.</li>
              </ul>
            </div>

            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <BookOpen className="w-5 h-5 text-[#C9A227]" />
                3. Intellectual Property & Media Release
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                <li>Photos and videos captured during official STR events may be featured in our photo gallery and promotional materials.</li>
                <li>All website branding, logos, and cultural materials are owned by Scotland Tamils Raise.</li>
              </ul>
            </div>

            <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <ShieldAlert className="w-5 h-5 text-[#C9A227]" />
                4. Governing Law
              </h2>
              <p className="text-slate-300 text-sm">
                These terms are governed by and construed in accordance with the laws of Scotland and the United Kingdom.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
