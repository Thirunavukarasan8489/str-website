'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validators';
import { ContactFormData } from '@/types';
import { MapPin, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      city: 'Edinburgh',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSubmitted(true);
      } else {
        setApiError(result.message || 'Submission failed. Please check inputs.');
      }
    } catch (err: any) {
      console.error(err);
      setApiError('Network error. Unable to send message right now.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Contact', item: '/contact' },
  ]);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            Contact <span className="gold-gradient-text">Scotland Tamils Raise</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Have questions about events, Tamil school registration, or volunteering? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0A1440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 sm:p-10 shadow-xl gold-glow-hover">
              <h2 className="text-2xl font-serif font-bold text-white mb-6">
                Send Us a Message
              </h2>

              {apiError && (
                <div className="mb-6 p-4 rounded-lg bg-[#8B1A2B]/20 border border-[#8B1A2B] text-[#E8C468] text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#8B1A2B] shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#C9A227] mx-auto" />
                  <h3 className="text-xl font-serif font-bold text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-300">
                    Thank you for reaching out. Our team will get back to you within 24–48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="Your name"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                        City / Region
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
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        {...register('subject')}
                        placeholder="Inquiry subject"
                        className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      {...register('message')}
                      placeholder="How can we assist you?"
                      className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 text-center font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] hover:from-[#E8C468] hover:to-[#C9A227] rounded-lg shadow-md transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Regional Contact Nodes */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 space-y-6 shadow-xl">
                <h3 className="text-xl font-serif font-bold text-white border-b border-white/10 pb-3">
                  Regional Organization Hubs
                </h3>

                <div className="space-y-4 text-sm text-slate-200">
                  {/* <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A227] shrink-0 mt-1" />
                    <div>
                      <span className="block font-bold text-white">Edinburgh (HQ)</span>
                      <span>George Street & Crichton Street Nodes, Edinburgh</span>
                    </div>
                  </div> */}

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A227] shrink-0 mt-1" />
                    <div>
                      <span className="block font-bold text-white">Glasgow, Scotland</span>
                      <span>City Centre & West End</span>
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A227] shrink-0 mt-1" />
                    <div>
                      <span className="block font-bold text-white">Aberdeen & Dundee</span>
                      <span>Grampian & Tayside Regional Engagement Coordinators</span>
                    </div>
                  </div> */}

                  <div className="flex items-start gap-3 pt-2">
                    <Mail className="w-5 h-5 text-[#C9A227] shrink-0 mt-1" />
                    <div>
                      <span className="block font-bold text-white">General Email</span>
                      <a href="mailto:contact@scotlandtamilsraise.org" className="text-[#E8C468] hover:underline">
                        contact@scotlandtamilsraise.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
