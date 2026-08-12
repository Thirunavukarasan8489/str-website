'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function notifyLiveContentUpdate() {
  if (typeof window !== 'undefined') {
    try {
      const timestamp = Date.now().toString();
      window.localStorage.setItem('str_live_sync', timestamp);
      window.dispatchEvent(new CustomEvent('str_live_sync', { detail: timestamp }));
    } catch (err) {
      console.warn('Live sync notification warning:', err);
    }
  }
}

export default function LiveRouteRefresher() {
  const router = useRouter();

  useEffect(() => {
    // 1. Listen for cross-tab storage sync events from Admin CMS
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'str_live_sync') {
        router.refresh();
      }
    };

    // 2. Listen for same-window custom sync events
    const handleCustomSync = () => {
      router.refresh();
    };

    // 3. Listen for window focus / visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        router.refresh();
      }
    };

    // 4. Periodic lightweight background refresh (every 25 seconds while tab is active)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        router.refresh();
      }
    }, 25000);

    window.addEventListener('storage', handleStorage);
    window.addEventListener('str_live_sync', handleCustomSync);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('str_live_sync', handleCustomSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleCustomSync);
      clearInterval(interval);
    };
  }, [router]);

  return null;
}
