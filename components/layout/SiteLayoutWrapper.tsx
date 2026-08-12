'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import LiveRouteRefresher from '@/components/shared/LiveRouteRefresher';

export default function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <LiveRouteRefresher />
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">{children}</main>
      <Footer />
    </>
  );
}
