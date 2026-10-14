'use client';

import React from 'react';
import { Settings, ShieldCheck, Database, Cloud, Key, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#1B3A6B] pb-6">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
          <span>Settings & Cloudinary Configuration</span>
          <Settings className="w-5 h-5 text-[#E8C468]" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Review system integrations, media storage credentials, database status, and admin access keys.
        </p>
      </div>

      {/* Cloudinary Integration Card */}
      <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0A1440] border border-[#C9A227]/40 flex items-center justify-center text-[#E8C468]">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">Cloudinary Image Storage</h3>
              <p className="text-xs text-slate-300">All photos uploaded via Admin are optimized & hosted on Cloudinary CDN.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        </div>

        <div className="bg-[#0A1440] border border-white/10 rounded-xl p-4 space-y-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">CLOUDINARY_CLOUD_NAME</span>
            <span className="text-[#E8C468] font-bold">Configured in .env</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-slate-400">CLOUDINARY_API_KEY</span>
            <span className="text-[#E8C468] font-bold">Configured in .env</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-slate-400">CLOUDINARY_API_SECRET</span>
            <span className="text-[#E8C468] font-bold">••••••••••••••••</span>
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed bg-[#1B3A6B]/30 border border-[#1B3A6B] rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">How Cloudinary Uploads Work:</span>
            <p className="mt-1">
              Whenever you drag and drop or select a photo in the Hero editor, Gallery, or News publisher, it is streamed to your Cloudinary media cloud and immediately returns a secure CDN link with responsive sizing.
            </p>
          </div>
        </div>
      </div>

      {/* Database Status Card */}
      <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0A1440] border border-[#C9A227]/40 flex items-center justify-center text-[#E8C468]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">MongoDB Atlas Connection</h3>
              <p className="text-xs text-slate-300">Stores live Leads, Hero settings, News articles, and Gallery data.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Connected
          </span>
        </div>
      </div>

      {/* Admin Access & Security */}
      <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0A1440] border border-[#C9A227]/40 flex items-center justify-center text-[#E8C468]">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-white">Admin Authentication & Password</h3>
            <p className="text-xs text-slate-300">Control who can access this dashboard and make live changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
