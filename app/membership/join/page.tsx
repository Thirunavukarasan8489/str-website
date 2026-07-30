'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { membershipSchema } from '@/lib/validators';
import { MembershipFormData } from '@/types';
import { MEMBERSHIP_TIERS } from '@/lib/data';
import { CheckCircle2, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function JoinMembershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      tier: 'family',
      interests: ['Festivals & Cultural Galas', 'Tamil Language Academy'],
      termsAgreed: true,
    },
  });

  const onSubmit = async (data: MembershipFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#0A1440] min-h-[85vh] flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#121F54] border border-[#C9A227]/40 rounded-2xl p-8 sm:p-10 shadow-2xl gold-glow">
          <div className="text-center mb-8">
            <span className="inline-block px-3.5 py-1 mb-2 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B] rounded-full border border-[#C9A227]/30">
              Registration Portal
            </span>
            <h1 className="text-3xl font-serif font-bold text-white">
              Join Scotland Tamils Raise
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Complete your membership registration to join our community network in Scotland.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1B3A6B] text-[#C9A227] flex items-center justify-center mx-auto border-2 border-[#C9A227]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">
                Registration Received!
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you for joining Scotland Tamils Raise. A confirmation email with payment details and membership welcome packet has been sent.
              </p>
              <div className="pt-4">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] rounded-lg shadow-md hover:brightness-110 transition-all text-sm"
                >
                  <span>Explore Upcoming Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="e.g. Dr. Selvanathan Ketheeswaran"
                    className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+44 7123 456789"
                    className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    City / Town *
                  </label>
                  <select
                    {...register('city')}
                    className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  >
                    <option value="Edinburgh">Edinburgh</option>
                    <option value="Glasgow">Glasgow</option>
                    <option value="Aberdeen">Aberdeen</option>
                    <option value="Dundee">Dundee</option>
                    <option value="Stirling">Stirling</option>
                    <option value="Inverness">Inverness</option>
                    <option value="Other">Other (Scotland)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    UK Postcode *
                  </label>
                  <input
                    type="text"
                    {...register('postcode')}
                    placeholder="EH1 1YZ"
                    className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                  {errors.postcode && (
                    <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.postcode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Membership Tier Select */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Select Membership Tier *
                </label>
                <select
                  {...register('tier')}
                  className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                >
                  {MEMBERSHIP_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name} — {tier.price} ({tier.period})
                    </option>
                  ))}
                </select>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('termsAgreed')}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-[#0A1440] text-[#C9A227] focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    I accept the Scotland Tamils Raise community code of conduct and agree to receive organization communications.
                  </span>
                </label>
                {errors.termsAgreed && (
                  <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.termsAgreed.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-center font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] hover:from-[#E8C468] hover:to-[#C9A227] rounded-lg shadow-lg hover:shadow-[#C9A227]/30 transition-all text-sm uppercase tracking-wider"
              >
                {loading ? 'Processing Registration...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
