'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Home as HomeIcon,
  Image as ImageIcon,
  Newspaper,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export type AdminTab = 'overview' | 'hero' | 'gallery' | 'news' | 'leads' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  leadsCount?: number;
  newsCount?: number;
  galleryCount?: number;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  leadsCount = 0,
  newsCount = 0,
  galleryCount = 0,
  onLogout,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
    { id: 'hero', label: 'Home Hero Section', icon: HomeIcon },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, badge: galleryCount },
    { id: 'news', label: 'News & Media', icon: Newspaper, badge: newsCount },
    { id: 'leads', label: 'Leads & Enquiries', icon: Users, badge: leadsCount },
    { id: 'settings', label: 'Settings & Cloudinary', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#070D2B] border-r border-[#1B3A6B] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="p-6 border-b border-[#1B3A6B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C9A227]">
                <Image src="/logo.png" alt="STR Logo" fill className="object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-white leading-tight">
                  STR Scotland
                </h2>
                <span className="text-[10px] text-[#E8C468] uppercase tracking-wider font-semibold">
                  Admin Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold shadow-md shadow-[#C9A227]/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#121F54]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A1440]' : 'text-[#C9A227]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${isActive ? 'bg-[#0A1440] text-[#E8C468]' : 'bg-[#1B3A6B] text-[#E8C468]'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#1B3A6B] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#121F54] hover:bg-[#1B3A6B] border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E8C468]" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-[#8B1A2B]/40 border border-[#8B1A2B]/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
