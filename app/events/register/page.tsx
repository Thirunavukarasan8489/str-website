import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import EventRegisterForm from './EventRegisterForm';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Event Ticket Registration | Scotland Tamils Raise',
  description:
    'Reserve your tickets and passes for upcoming Tamil community cultural events, festivals, and Galas across Scotland.',
};

export default function EventRegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A1440] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
            <p className="text-sm text-slate-300">Loading Event Ticket Registration...</p>
          </div>
        </div>
      }
    >
      <EventRegisterForm />
    </Suspense>
  );
}
