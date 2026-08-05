'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Heart, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNewsletter = async (e: React.FormEvent) => {
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
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        setErrorMsg(data.message || 'Subscription failed.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#070D2B] text-slate-300 border-t border-[#1B3A6B]/50 relative overflow-hidden">
      {/* Decorative Gold Accent Border */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0A1440] via-[#C9A227] to-[#0A1440]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A227] to-[#E8C468] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#0A1440] rounded-full flex items-center justify-center overflow-hidden relative">
                  <Image
                    src="/logo.png"
                    alt="Scotland Tamils Raise Logo"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-tight group-hover:text-[#E8C468] transition-colors">
                Scotland Tamils Raise
              </span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Connecting Tamil families, students, and professionals across Scotland. Celebrating Tamil language, ancient heritage, and vibrant integration within Scottish society.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#1B3A6B]/50 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#E8C468] hover:border-[#C9A227] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#1B3A6B]/50 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#E8C468] hover:border-[#C9A227] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-[#1B3A6B]/50 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#E8C468] hover:border-[#C9A227] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif font-semibold text-base mb-4 border-b border-[#C9A227]/30 pb-2 inline-block">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#E8C468] transition-colors">
                  About Organization
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#E8C468] transition-colors">
                  Upcoming & Past Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#E8C468] transition-colors">
                  Photo & Video Gallery
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-[#E8C468] transition-colors">
                  Membership Tiers
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#E8C468] transition-colors">
                  News & Press Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Nodes */}
          <div>
            <h3 className="text-white font-serif font-semibold text-base mb-4 border-b border-[#C9A227]/30 pb-2 inline-block">
              Location
            </h3>
            <ul className="space-y-2.5 text-sm">
              {/* <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>Edinburgh (Capital Hub)</span>
              </li> */}
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>Glasgow</span>
              </li>
              {/* <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>Aberdeen (Grampian Node)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>Dundee & Stirling</span>
              </li> */}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h3 className="text-white font-serif font-semibold text-base mb-4 border-b border-[#C9A227]/30 pb-2 inline-block">
              Community Newsletter
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for event announcements, Tamil Academy updates, and cultural stories.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#1B3A6B]/80 border border-[#C9A227] rounded-lg text-xs text-[#E8C468] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C9A227]" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#121F54] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                {errorMsg && (
                  <p className="text-[11px] text-[#8B1A2B] font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] rounded-lg hover:brightness-110 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3 h-3" /> Subscribe Now
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Scotland Tamils Raise. Registered Community Organization in Scotland.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-[#E8C468] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#E8C468] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#E8C468] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
