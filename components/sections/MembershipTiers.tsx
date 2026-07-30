import React from 'react';
import Link from 'next/link';
import { Check, Star, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import CTAButton from '@/components/shared/CTAButton';
import { MEMBERSHIP_TIERS } from '@/lib/data';

export default function MembershipTiers() {
  return (
    <section className="py-20 bg-[#070D2B] border-t border-[#1B3A6B]/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Become a Member"
          title="Join Scotland Tamils Raise Community"
          subtitle="Select the membership plan that fits your family or individual journey. Enjoy discounted gala tickets, voting rights, and language academy placement."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-[#121F54] border rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                tier.isPopular
                  ? 'border-[#C9A227] gold-glow'
                  : 'border-[#1B3A6B] hover:border-[#C9A227]/60'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold text-xs shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#0A1440]" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs text-slate-300 min-h-[36px] mb-4">
                  {tier.description}
                </p>

                <div className="my-4 pb-4 border-b border-white/10">
                  <span className="text-3xl font-serif font-extrabold text-[#E8C468]">
                    {tier.price}
                  </span>
                  <span className="text-xs text-slate-400 font-medium ml-1">
                    / {tier.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <CTAButton
                href={`/membership/join?tier=${tier.id}`}
                variant={tier.isPopular ? 'primary' : 'secondary'}
                className="w-full text-center"
              >
                <span>{tier.ctaText}</span>
              </CTAButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
