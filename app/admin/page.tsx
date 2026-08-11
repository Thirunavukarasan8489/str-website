'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import AdminOverview from '@/components/admin/AdminOverview';
import HeroManager from '@/components/admin/HeroManager';
import GalleryManager from '@/components/admin/GalleryManager';
import NewsManager from '@/components/admin/NewsManager';
import LeadsManager from '@/components/admin/LeadsManager';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import { Menu, Loader2, ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [leadsCount, setLeadsCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    checkAuth();
    loadBadges();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      setIsAuthenticated(Boolean(data.authenticated));
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadBadges = async () => {
    try {
      const [leadsRes, newsRes, galleryRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/news'),
        fetch('/api/admin/gallery'),
      ]);
      const leads = await leadsRes.json();
      const news = await newsRes.json();
      const gallery = await galleryRes.json();

      setLeadsCount((leads.members?.length || 0) + (leads.messages?.length || 0));
      setNewsCount(news.articles?.length || 0);
      setGalleryCount(gallery.items?.length || 0);
    } catch (err) {
      console.error('Error loading badge stats', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A1440] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
          <p className="text-sm text-slate-300">Loading Scotland Tamils Raise Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginModal onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0A1440] text-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        leadsCount={leadsCount}
        newsCount={newsCount}
        galleryCount={galleryCount}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#070D2B]/90 backdrop-blur-md border-b border-[#1B3A6B] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#121F54] text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-slate-400 font-medium">STR Admin</span>
              <span className="text-slate-600">/</span>
              <span className="text-[#E8C468] font-bold capitalize">
                {activeTab === 'hero'
                  ? 'Hero Section'
                  : activeTab === 'leads'
                  ? 'Leads & Inquiries'
                  : activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#121F54] border border-white/10 hover:border-[#C9A227]/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E8C468]" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-[#8B1A2B]/20 hover:bg-[#8B1A2B]/40 border border-[#8B1A2B]/40 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <AdminOverview onSelectTab={setActiveTab} />}
          {activeTab === 'hero' && <HeroManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'leads' && <LeadsManager />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
