'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Image as ImageIcon,
  Newspaper,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  LayoutDashboard,
  SquarePen,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminOverviewProps {
  onSelectTab: (tab: AdminTab) => void;
}

export default function AdminOverview({ onSelectTab }: AdminOverviewProps) {
  const [stats, setStats] = useState({
    members: 0,
    messages: 0,
    subscribers: 0,
    gallery: 0,
    news: 0,
  });
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllStats() {
      try {
        const [leadsRes, galleryRes, newsRes] = await Promise.all([
          fetch('/api/admin/leads'),
          fetch('/api/admin/gallery'),
          fetch('/api/admin/news'),
        ]);

        const leadsData = await leadsRes.json();
        const galleryData = await galleryRes.json();
        const newsData = await newsRes.json();

        setStats({
          members: leadsData.members?.length || 0,
          messages: leadsData.messages?.length || 0,
          subscribers: leadsData.subscribers?.length || 0,
          gallery: galleryData.items?.length || 0,
          news: newsData.articles?.length || 0,
        });

        if (leadsData.members) {
          setRecentMembers(leadsData.members.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllStats();
  }, []);

  const totalLeads = stats.members + stats.messages + stats.subscribers;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-[#121F54] via-[#1B3A6B] to-[#0A1440] border border-[#C9A227]/40 shadow-2xl overflow-hidden gold-glow">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1440]/80 border border-[#C9A227]/30 text-[#E8C468] text-xs font-semibold">
            {/* <Sparkles className="w-3.5 h-3.5" /> */}
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Welcome to Scotland Tamils Raise Admin Suite</span>
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-white">
            Control Website & Leads <span className="gold-gradient-text">Without Code</span>
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            Manage your homepage hero, publish news announcements, upload celebration photos via Cloudinary, and monitor community membership applications in real time.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => onSelectTab('leads')}
          className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227] rounded-2xl p-6 shadow-xl cursor-pointer transition-all hover:-translate-y-1 group gold-glow-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1440] text-[#E8C468] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#E8C468] flex items-center gap-1">
              View Leads <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="block text-3xl font-serif font-extrabold text-white">{stats.members}</span>
          <span className="text-xs text-slate-300 font-medium">Registered Members</span>
        </div>

        <div
          onClick={() => onSelectTab('leads')}
          className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227] rounded-2xl p-6 shadow-xl cursor-pointer transition-all hover:-translate-y-1 group gold-glow-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1440] text-[#E8C468] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#E8C468] flex items-center gap-1">
              Inquiries <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="block text-3xl font-serif font-extrabold text-white">{stats.messages}</span>
          <span className="text-xs text-slate-300 font-medium">Contact Form Messages</span>
        </div>

        <div
          onClick={() => onSelectTab('gallery')}
          className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227] rounded-2xl p-6 shadow-xl cursor-pointer transition-all hover:-translate-y-1 group gold-glow-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1440] text-[#E8C468] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#E8C468] flex items-center gap-1">
              Gallery <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="block text-3xl font-serif font-extrabold text-white">{stats.gallery}</span>
          <span className="text-xs text-slate-300 font-medium">Photos in Gallery</span>
        </div>

        <div
          onClick={() => onSelectTab('news')}
          className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227] rounded-2xl p-6 shadow-xl cursor-pointer transition-all hover:-translate-y-1 group gold-glow-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1440] text-[#E8C468] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Newspaper className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#E8C468] flex items-center gap-1">
              Articles <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="block text-3xl font-serif font-extrabold text-white">{stats.news}</span>
          <span className="text-xs text-slate-300 font-medium">Published News Posts</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-serif font-bold text-white">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onSelectTab('hero')}
            className="p-4 rounded-xl bg-[#0A1440] hover:bg-[#1B3A6B] border border-white/10 text-left transition-colors flex items-center gap-3"
          >
            <SquarePen className="w-5 h-5 text-[#E8C468]" />
            <div>
              <div className="text-xs font-bold text-white">Edit Hero Banner</div>
              <div className="text-[11px] text-slate-400">Change photo & headlines</div>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('gallery')}
            className="p-4 rounded-xl bg-[#0A1440] hover:bg-[#1B3A6B] border border-white/10 text-left transition-colors flex items-center gap-3"
          >
            <ImageIcon className="w-5 h-5 text-[#E8C468]" />
            <div>
              <div className="text-xs font-bold text-white">Upload New Photo</div>
              <div className="text-[11px] text-slate-400">Cloudinary media manager</div>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('news')}
            className="p-4 rounded-xl bg-[#0A1440] hover:bg-[#1B3A6B] border border-white/10 text-left transition-colors flex items-center gap-3"
          >
            <Newspaper className="w-5 h-5 text-[#E8C468]" />
            <div>
              <div className="text-xs font-bold text-white">Write Announcement</div>
              <div className="text-[11px] text-slate-400">Publish news release</div>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('leads')}
            className="p-4 rounded-xl bg-[#0A1440] hover:bg-[#1B3A6B] border border-white/10 text-left transition-colors flex items-center gap-3"
          >
            <Users className="w-5 h-5 text-[#E8C468]" />
            <div>
              <div className="text-xs font-bold text-white">Review Registrations</div>
              <div className="text-[11px] text-slate-400">{stats.members} recent applicants</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Membership Submissions Preview */}
      <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-white">Recent Member Registrations</h3>
          <button
            onClick={() => onSelectTab('leads')}
            className="text-xs text-[#E8C468] hover:underline font-semibold"
          >
            View All ({stats.members})
          </button>
        </div>

        {recentMembers.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No recent membership applications yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {recentMembers.map((m) => (
              <div key={m._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{m.fullName}</div>
                  <div className="text-[11px] text-slate-400">{m.email} • {m.city}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#1B3A6B] text-[#E8C468]">
                    {m.tier}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
