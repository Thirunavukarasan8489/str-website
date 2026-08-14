'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import CTAButton from '@/components/shared/CTAButton';
import { EventItem } from '@/types';
import { formatDate, parseTicketTiers, TicketTier } from '@/lib/utils';

export default function EventRegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventParam = searchParams.get('event');

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation screen state
  const [confirmation, setConfirmation] = useState<{
    bookingId: string;
    eventTitle: string;
    eventDate: string;
    eventVenue: string;
    fullName: string;
    email: string;
    phone: string;
    ticketType: string;
    quantity: number;
  } | null>(null);

  useEffect(() => {
    fetchEventsList();
  }, []);

  const fetchEventsList = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (res.ok && Array.isArray(data.events)) {
        setEvents(data.events);

        // Pre-select event based on query param or default to first active event
        if (eventParam) {
          const match = data.events.find((e: EventItem) => e.slug === eventParam);
          if (match) {
            setSelectedEvent(match);
            const tiers = parseTicketTiers(match.price, match.ticketTiers);
            if (tiers.length > 0) {
              setTicketType(`${tiers[0].name}${tiers[0].price ? ` - ${tiers[0].price}` : ''}`);
            } else {
              setTicketType(match.price || 'General Admission - Free');
            }
          } else if (data.events.length > 0) {
            setSelectedEvent(data.events[0]);
          }
        } else if (data.events.length > 0) {
          setSelectedEvent(data.events[0]);
          const first = data.events[0];
          const tiers = parseTicketTiers(first.price, first.ticketTiers);
          if (tiers.length > 0) {
            setTicketType(`${tiers[0].name}${tiers[0].price ? ` - ${tiers[0].price}` : ''}`);
          } else {
            setTicketType(first.price || 'General Admission - Free');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load events list', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleSelectEvent = (slug: string) => {
    const found = events.find((e) => e.slug === slug);
    if (found) {
      setSelectedEvent(found);
      const tiers = parseTicketTiers(found.price, found.ticketTiers);
      if (tiers.length > 0) {
        setTicketType(`${tiers[0].name}${tiers[0].price ? ` - ${tiers[0].price}` : ''}`);
      } else {
        setTicketType(found.price || 'General Admission - Free');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      setErrorMessage('Please select an event to register.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your UK mobile contact number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug: selectedEvent.slug,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          ticketType: ticketType || 'Standard Ticket',
          quantity,
          notes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmation({
          bookingId: data.bookingId,
          eventTitle: selectedEvent.title,
          eventDate: `${formatDate(selectedEvent.date)} (${selectedEvent.time})`,
          eventVenue: `${selectedEvent.venue}, ${selectedEvent.city}`,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          ticketType: ticketType || 'Standard Ticket',
          quantity,
        });
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration submission error', err);
      setErrorMessage('A network error occurred. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const parsedTiers: TicketTier[] = selectedEvent
    ? parseTicketTiers(selectedEvent.price, selectedEvent.ticketTiers)
    : [];

  return (
    <div className="min-h-screen bg-[#0A1440] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <div className="print-hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E8C468] hover:text-[#C9A227] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events Calendar</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3 print-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3A6B] border border-[#C9A227]/40 text-xs font-bold text-[#E8C468]">
            <Ticket className="w-3.5 h-3.5" />
            <span>Event Registration &amp; Pass Reservation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Reserve Your Tickets
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Secure your spot for Tamil cultural celebrations, community galas, and youth summits across Scotland.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CONFIRMATION SCREEN MODAL */}
        {/* ========================================================================= */}
        {confirmation ? (
          <div className="printable-ticket-card bg-[#121F54] border border-[#C9A227] rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl gold-glow animate-fade-in">
            {/* Header visible ONLY during Print / Save PDF */}
            <div className="hidden print:flex items-center justify-between border-b-2 border-[#C9A227] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C9A227]">
                  <Image src="/logo.png" alt="STR Logo" fill className="object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0A1440]">Scotland Tamils Raise</h2>
                  <span className="text-xs font-semibold text-[#B38914] uppercase tracking-wider block">
                    Official Event Admission Ticket Pass
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Booking Ref Code</span>
                <span className="text-lg font-mono font-bold text-[#B38914]">{confirmation.bookingId}</span>
              </div>
            </div>

            <div className="text-center space-y-3 print-hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">Ticket Reserved Successfully!</h2>
              <p className="text-xs text-slate-300">
                Your reservation confirmation has been generated. Please keep your reference code.
              </p>
            </div>

            {/* Booking Reference Ticket Card */}
            <div className="ticket-bg-box bg-[#0A1440] border border-[#C9A227]/40 rounded-xl p-5 sm:p-6 space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                    Booking Reference Code
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-bold text-[#E8C468] gold-text tracking-wider">
                    {confirmation.bookingId}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 badge-confirmed text-xs font-bold self-start sm:self-center">
                  Status: Confirmed
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Event Name:</span>
                  <span className="text-white font-bold text-sm">{confirmation.eventTitle}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Date &amp; Time:</span>
                  <span className="text-white font-bold">{confirmation.eventDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Venue:</span>
                  <span className="text-white font-bold">{confirmation.eventVenue}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Selected Pass / Ticket Option:</span>
                  <span className="text-[#E8C468] gold-text font-bold">
                    {confirmation.quantity}x {confirmation.ticketType}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Attendee Name:</span>
                  <span className="text-white font-semibold">{confirmation.fullName}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Contact Details:</span>
                  <span className="text-white font-semibold">{confirmation.email} ({confirmation.phone})</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 print-hidden">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1B3A6B] hover:bg-[#121F54] border border-[#C9A227]/40 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
              >
                <Printer className="w-full text-[#E8C468]" />
                <span>Print / Save Confirmation</span>
              </button>

              <CTAButton href="/events" variant="primary" className="w-full sm:w-auto text-center">
                Return to Events Calendar
              </CTAButton>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* REGISTRATION FORM CARD */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Event Summary Side Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl overflow-hidden shadow-xl gold-glow flex flex-col justify-between">
                {/* Event Selector Dropdown */}
                <div className="p-5 border-b border-white/10 bg-[#070D2B]">
                  <label className="block text-xs font-bold text-[#E8C468] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C9A227]" />
                    <span>Select Event to Register *</span>
                  </label>
                  {loadingEvents ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                      <span>Loading active events...</span>
                    </div>
                  ) : (
                    <select
                      value={selectedEvent?.slug || ''}
                      onChange={(e) => handleSelectEvent(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0A1440] border border-[#C9A227]/50 text-white text-xs font-semibold focus:outline-none focus:border-[#C9A227]"
                    >
                      {events.map((evt) => (
                        <option key={evt.slug} value={evt.slug}>
                          {evt.title} ({formatDate(evt.date)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Event Preview Banner */}
                {selectedEvent && (
                  <div className="p-5 space-y-4">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden border border-white/10">
                      <Image
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121F54] via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 px-2.5 py-0.5 text-[10px] font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] rounded-full">
                        {selectedEvent.category}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-serif font-bold text-white leading-snug">
                        {selectedEvent.title}
                      </h3>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C9A227] shrink-0" />
                          <span>{formatDate(selectedEvent.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#C9A227] shrink-0" />
                          <span>{selectedEvent.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
                          <span>{selectedEvent.venue}, {selectedEvent.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-[#0A1440]/60 border-t border-white/10 text-center">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Official Scotland Tamils Raise Community Event</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#E8C468]" />
                  <span>Attendee &amp; Ticket Selection</span>
                </h3>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-[#8B1A2B]/30 border border-[#8B1A2B] text-rose-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Your Name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                        UK Mobile Contact Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 07700 900077"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ticket Pass Option Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#E8C468] uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Select Ticket Pass / Pricing Option *</span>
                      <span className="text-[10px] text-slate-400 font-normal">Choose tier</span>
                    </label>

                    {parsedTiers.length > 0 ? (
                      <div className="space-y-2">
                        {parsedTiers.map((tier, idx) => {
                          const optionValue = `${tier.name}${tier.price ? ` - ${tier.price}` : ''}`;
                          const isSelected = ticketType === optionValue;
                          return (
                            <label
                              key={idx}
                              onClick={() => setTicketType(optionValue)}
                              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#1B3A6B] border-[#C9A227] text-white shadow-md'
                                  : 'bg-[#0A1440] border-white/10 text-slate-300 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="ticketPass"
                                  checked={isSelected}
                                  onChange={() => setTicketType(optionValue)}
                                  className="accent-[#C9A227]"
                                />
                                <span className="text-xs font-semibold">{tier.name}</span>
                              </div>
                              {tier.price && (
                                <span className="text-xs font-bold text-[#E8C468] bg-[#0A1440] px-2.5 py-0.5 rounded border border-[#C9A227]/30">
                                  {tier.price}
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                        placeholder="General Entry / Free Pass"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                      />
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                        Number of Passes / Quantity *
                      </label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#C9A227]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Pass / Ticket' : 'Passes / Tickets'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0A1440] border border-white/10 flex flex-col justify-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Booking Summary</span>
                      <span className="text-xs font-bold text-[#E8C468] truncate">
                        {quantity}x {ticketType || 'Standard Ticket'}
                      </span>
                    </div>
                  </div>

                  {/* Special Requests / Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                      Special Requests / Accessibility / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Wheelchair access needed, dietary preferences..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Tickets...</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        <span>Confirm Ticket Reservation</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
