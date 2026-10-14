'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, Key, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ onLoginSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess();
      } else {
        setError(data.message || 'Enter your admin password to access the dashboard.');
      }
    } catch (err: any) {
      setError('Network error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1440] tartan-pattern flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#121F54] border border-[#C9A227]/40 rounded-3xl p-8 shadow-2xl gold-glow space-y-6">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#C9A227] shadow-lg">
            <Image src="/logo.png" alt="STR Logo" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">
              Scotland Tamils Raise
            </h1>
            <p className="text-xs text-[#E8C468] uppercase tracking-wider font-semibold mt-0.5">
              Secure Admin Control Center
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#8B1A2B]/25 border border-[#8B1A2B] text-[#E8C468] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#8B1A2B] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] hover:from-[#E8C468] hover:to-[#C9A227] text-[#0A1440] shadow-lg hover:shadow-[#C9A227]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            For password resets, check in your environment file.
          </p>
        </div> */}
      </div>
    </div>
  );
}
