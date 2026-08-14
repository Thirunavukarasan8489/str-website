'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  X,
  FileSpreadsheet,
  Check,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface EventRegistrationItem {
  _id: string;
  bookingId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  eventVenue?: string;
  fullName: string;
  email: string;
  phone: string;
  ticketType: string;
  quantity: number;
  totalPrice?: string;
  notes?: string;
  status: 'Confirmed' | 'Attended' | 'Cancelled';
  createdAt: string;
}

export default function EventBookingsManager() {
  const [registrations, setRegistrations] = useState<EventRegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Attended' | 'Cancelled'>('All');
  const [selectedEventTitle, setSelectedEventTitle] = useState('All');

  // Modal / Delete state
  const [deleteTarget, setDeleteTarget] = useState<EventRegistrationItem | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const res = await fetch(`/api/events/register?t=${timestamp}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.registrations) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error('Error loading event registrations', err);
      showToast('error', 'Failed to load event registrations from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Confirmed' | 'Attended' | 'Cancelled') => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/events/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg._id === id ? { ...reg, status: newStatus } : reg))
        );
        showToast('success', `Booking status updated to ${newStatus}!`);
      } else {
        showToast('error', data.message || 'Failed to update status.');
      }
    } catch {
      showToast('error', 'Error updating registration status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading('delete');
    try {
      const res = await fetch(`/api/events/register?id=${deleteTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations((prev) => prev.filter((r) => r._id !== deleteTarget._id));
        showToast('success', 'Registration record deleted.');
        setDeleteTarget(null);
      } else {
        showToast('error', data.message || 'Failed to delete record.');
      }
    } catch {
      showToast('error', 'Error deleting record.');
    } finally {
      setActionLoading(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      showToast('error', 'No registration records to export.');
      return;
    }

    const headers = [
      'Booking ID',
      'Event Title',
      'Event Date',
      'Full Name',
      'Email Address',
      'UK Mobile Phone',
      'Ticket Option / Pass',
      'Quantity',
      'Status',
      'Notes',
      'Date Booked',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.bookingId}"`,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.eventDate}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.ticketType.replace(/"/g, '""')}"`,
      r.quantity,
      `"${r.status}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${formatDate(r.createdAt)}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `scotland-tamils-raise-event-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Exported event registrations to CSV!');
  };

  // Get unique event titles for filtering
  const uniqueEventTitles = Array.from(new Set(registrations.map((r) => r.eventTitle)));

  // Filtered List
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.phone.includes(searchQuery) ||
      reg.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || reg.status === statusFilter;
    const matchesEvent = selectedEventTitle === 'All' || reg.eventTitle === selectedEventTitle;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Calculate Metrics
  const totalBookings = registrations.length;
  const totalTickets = registrations.reduce((acc, r) => acc + (r.quantity || 1), 0);
  const attendedCount = registrations.filter((r) => r.status === 'Attended').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-3 border ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Overview Stats */}
      <div className="bg-[#121F54] border border-[#1B3A6B] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#E8C468]" />
            <span>Event Bookings &amp; Registrations</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Track user registrations, UK contact numbers, ticket passes, and check-in status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRegistrations}
            className="p-2.5 rounded-xl bg-[#0A1440] border border-white/10 hover:border-[#C9A227]/40 text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C9A227]' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121F54] border border-[#1B3A6B] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1B3A6B] text-[#E8C468] flex items-center justify-center font-bold">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Registrations</span>
            <span className="text-2xl font-serif font-bold text-white">{totalBookings}</span>
          </div>
        </div>

        <div className="bg-[#121F54] border border-[#1B3A6B] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1B3A6B] text-[#E8C468] flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Passes Reserved</span>
            <span className="text-2xl font-serif font-bold text-[#E8C468]">{totalTickets}</span>
          </div>
        </div>

        <div className="bg-[#121F54] border border-[#1B3A6B] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Attended &amp; Checked-in</span>
            <span className="text-2xl font-serif font-bold text-emerald-400">{attendedCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Email, UK Phone, Booking ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        <div>
          <select
            value={selectedEventTitle}
            onChange={(e) => setSelectedEventTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
          >
            <option value="All">All Registered Events</option>
            {uniqueEventTitles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex rounded-xl bg-[#0A1440] p-1 border border-white/10">
          {(['All', 'Confirmed', 'Attended', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Table / Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading registrations from database...</p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="py-20 text-center bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 space-y-3">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-white">No registrations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No event ticket bookings match your current search and filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl overflow-hidden shadow-xl">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070D2B] text-slate-300 border-b border-white/10 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Booking Ref</th>
                  <th className="p-4">Attendee Info</th>
                  <th className="p-4">Event Details</th>
                  <th className="p-4">Ticket Pass Option</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-[#0A1440]/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#E8C468] block">{reg.bookingId}</span>
                      <span className="text-[10px] text-slate-400">{formatDate(reg.createdAt)}</span>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <span className="font-bold text-white block">{reg.fullName}</span>
                      <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{reg.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                        <Phone className="w-3 h-3 text-[#C9A227] shrink-0" />
                        <span className="font-semibold text-[#E8C468]">{reg.phone}</span>
                      </div>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <span className="font-semibold text-white block leading-snug">{reg.eventTitle}</span>
                      {reg.eventDate && (
                        <span className="text-[11px] text-slate-400 block">
                          {formatDate(reg.eventDate)} {reg.eventTime ? `(${reg.eventTime})` : ''}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-white bg-[#0A1440] px-2.5 py-1 rounded border border-white/10 inline-block">
                        {reg.ticketType}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-white text-sm bg-[#1B3A6B] px-2.5 py-1 rounded-full border border-[#C9A227]/30">
                        {reg.quantity}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                          reg.status === 'Attended'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : reg.status === 'Cancelled'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1">
                      {reg.status !== 'Attended' && (
                        <button
                          onClick={() => handleUpdateStatus(reg._id, 'Attended')}
                          className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-700 text-emerald-300 hover:text-white border border-emerald-500/40 transition-colors"
                          title="Mark as Attended / Checked-in"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {reg.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(reg._id, 'Cancelled')}
                          className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-700 text-amber-300 hover:text-white border border-amber-500/40 transition-colors"
                          title="Mark as Cancelled"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTarget(reg)}
                        className="p-1.5 rounded-lg bg-[#8B1A2B]/30 hover:bg-[#8B1A2B] text-rose-300 hover:text-white transition-colors"
                        title="Delete Registration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="lg:hidden divide-y divide-white/10 p-4 space-y-4">
            {filteredRegistrations.map((reg) => (
              <div key={reg._id} className="pt-4 first:pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#E8C468] text-xs">{reg.bookingId}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      reg.status === 'Attended'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : reg.status === 'Cancelled'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {reg.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{reg.fullName}</h4>
                  <p className="text-xs text-slate-300">{reg.email} • <strong className="text-[#E8C468]">{reg.phone}</strong></p>
                </div>

                <div className="p-3 rounded-xl bg-[#0A1440] text-xs space-y-1 border border-white/5">
                  <p className="font-bold text-white">{reg.eventTitle}</p>
                  <p className="text-slate-400">{reg.eventDate}</p>
                  <p className="text-[#E8C468] font-semibold pt-1">
                    Option: {reg.ticketType} (x{reg.quantity})
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {reg.status !== 'Attended' && (
                    <button
                      onClick={() => handleUpdateStatus(reg._id, 'Attended')}
                      className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Check-in</span>
                    </button>
                  )}
                  {reg.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(reg._id, 'Cancelled')}
                      className="px-3 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(reg)}
                    className="p-1.5 rounded-lg bg-[#8B1A2B]/40 text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121F54] border border-[#8B1A2B] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" />
              <span>Delete Ticket Registration</span>
            </h3>

            <p className="text-xs text-slate-300">
              Are you sure you want to delete the booking reference{' '}
              <strong className="text-[#E8C468]">{deleteTarget.bookingId}</strong> for{' '}
              <strong className="text-white">{deleteTarget.fullName}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={Boolean(actionLoading)}
                className="px-4 py-2 rounded-xl bg-[#8B1A2B] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
