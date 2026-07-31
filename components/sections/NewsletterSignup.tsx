'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, AlertCircle, Loader2 } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setErrorMsg(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#0A1440] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#121F54] via-[#1B3A6B] to-[#121F54] p-8 md:p-12 border border-[#C9A227]/40 shadow-2xl overflow-hidden gold-glow">
          {/* Subtle Decorative Pattern Overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8C468] bg-[#0A1440]/60 px-3 py-1 rounded-full border border-[#C9A227]/30">
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                Stay Connected
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                Subscribe to Scotland Tamils Raise Updates
              </h2>
              <p className="text-xs md:text-sm text-slate-200">
                Get early-bird announcements for Pongal & Chithirai Vizha, weekend Tamil school schedules, and community news delivered to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {submitted ? (
                <div className="p-4 rounded-xl bg-[#0A1440] border border-[#C9A227] text-center text-sm font-semibold text-[#E8C468] flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A227]" />
                  <span>Welcome to our community newsletter!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="w-full flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#0A1440] border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
                    />
                    {errorMsg && (
                      <p className="mt-1 text-xs text-[#8B1A2B] font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errorMsg}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] hover:from-[#E8C468] hover:to-[#C9A227] rounded-lg transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
