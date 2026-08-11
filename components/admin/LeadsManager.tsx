'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  MessageSquare,
  Search,
  Download,
  Trash2,
  Eye,
  Loader2,
  Calendar,
  Phone,
  MapPin,
  Tag,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export type LeadType = 'members' | 'messages' | 'subscribers';

export default function LeadsManager() {
  const [activeTab, setActiveTab] = useState<LeadType>('members');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');

  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
        setMessages(data.messages || []);
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error('Failed to load leads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/admin/leads?type=${type}&id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (type === 'member') setMembers(members.filter((m) => m._id !== id));
        if (type === 'message') setMessages(messages.filter((m) => m._id !== id));
        if (type === 'subscriber') setSubscribers(subscribers.filter((s) => s._id !== id));
        if (selectedLead?._id === id) setSelectedLead(null);
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (activeTab === 'members') {
      headers = ['Full Name', 'Email', 'Phone', 'City', 'Postcode', 'Tier', 'Interests', 'Date'];
      rows = members.map((m) => [
        `"${m.fullName || ''}"`,
        `"${m.email || ''}"`,
        `"${m.phone || ''}"`,
        `"${m.city || ''}"`,
        `"${m.postcode || ''}"`,
        `"${m.tier || ''}"`,
        `"${(m.interests || []).join(', ')}"`,
        `"${new Date(m.createdAt).toLocaleDateString()}"`,
      ]);
      filename = `str-members-${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeTab === 'messages') {
      headers = ['Full Name', 'Email', 'City', 'Subject', 'Message', 'Date'];
      rows = messages.map((m) => [
        `"${m.fullName || ''}"`,
        `"${m.email || ''}"`,
        `"${m.city || ''}"`,
        `"${m.subject || ''}"`,
        `"${(m.message || '').replace(/"/g, '""')}"`,
        `"${new Date(m.createdAt).toLocaleDateString()}"`,
      ]);
      filename = `str-contact-messages-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      headers = ['Email', 'Status', 'Date'];
      rows = subscribers.map((s) => [
        `"${s.email || ''}"`,
        `"${s.active ? 'Active' : 'Inactive'}"`,
        `"${new Date(s.createdAt).toLocaleDateString()}"`,
      ]);
      filename = `str-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm) ||
      m.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = cityFilter === 'All' || m.city === cityFilter;
    const matchTier = tierFilter === 'All' || m.tier?.toLowerCase() === tierFilter.toLowerCase();
    return matchSearch && matchCity && matchTier;
  });

  const filteredMessages = messages.filter((m) => {
    return (
      m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredSubscribers = subscribers.filter((s) => {
    return s.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B3A6B] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Leads & Inquiries Center</span>
            <Users className="w-5 h-5 text-[#E8C468]" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review incoming membership applications, general contact inquiries, and email newsletter subscribers.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#121F54] hover:bg-[#1B3A6B] text-[#E8C468] border border-[#C9A227]/40 shadow-md transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export {activeTab.toUpperCase()} to CSV</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('members')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            activeTab === 'members'
              ? 'bg-[#1B3A6B] border-[#C9A227] shadow-lg gold-glow'
              : 'bg-[#121F54] border-white/10 hover:border-white/20 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A1440] flex items-center justify-center text-[#E8C468]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Membership Registrations</h4>
              <p className="text-xs text-slate-300">{members.length} Total Registered</p>
            </div>
          </div>
          <span className="text-xl font-serif font-bold text-[#E8C468]">{members.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            activeTab === 'messages'
              ? 'bg-[#1B3A6B] border-[#C9A227] shadow-lg gold-glow'
              : 'bg-[#121F54] border-white/10 hover:border-white/20 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A1440] flex items-center justify-center text-[#E8C468]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Contact Messages</h4>
              <p className="text-xs text-slate-300">{messages.length} Queries</p>
            </div>
          </div>
          <span className="text-xl font-serif font-bold text-[#E8C468]">{messages.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            activeTab === 'subscribers'
              ? 'bg-[#1B3A6B] border-[#C9A227] shadow-lg gold-glow'
              : 'bg-[#121F54] border-white/10 hover:border-white/20 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A1440] flex items-center justify-center text-[#E8C468]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Newsletter Audience</h4>
              <p className="text-xs text-slate-300">{subscribers.length} Subscribers</p>
            </div>
          </div>
          <span className="text-xl font-serif font-bold text-[#E8C468]">{subscribers.length}</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-[#121F54] border border-[#1B3A6B] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A1440] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        {activeTab === 'members' && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-[#E8C468]" />
              <span>City:</span>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
              >
                <option value="All">All Cities</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="Glasgow">Glasgow</option>
                <option value="Aberdeen">Aberdeen</option>
                <option value="Dundee">Dundee</option>
                <option value="Stirling">Stirling</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span>Tier:</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
              >
                <option value="All">All Tiers</option>
                <option value="family">Family</option>
                <option value="individual">Individual</option>
                <option value="student">Student</option>
                <option value="lifetime">Patron</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
          <p className="text-sm text-slate-300">Loading Leads...</p>
        </div>
      ) : activeTab === 'members' ? (
        /* Members Table */
        <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl overflow-hidden shadow-xl">
          {filteredMembers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No membership registrations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#0A1440] uppercase tracking-wider text-[10px] text-slate-400 font-bold border-b border-[#1B3A6B]">
                  <tr>
                    <th className="px-5 py-4">Applicant</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">City / Postcode</th>
                    <th className="px-5 py-4">Tier</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredMembers.map((m) => (
                    <tr key={m._id} className="hover:bg-[#1B3A6B]/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">
                        <div>{m.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {(m.interests || []).slice(0, 2).join(', ')}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-200">{m.email}</div>
                        <div className="text-slate-400 text-[11px]">{m.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div>{m.city}</div>
                        <div className="text-slate-400 text-[11px]">{m.postcode}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1B3A6B] text-[#E8C468] border border-[#C9A227]/30">
                          {m.tier}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(m)}
                            className="p-1.5 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-200 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('member', m._id)}
                            className="p-1.5 rounded-lg bg-[#8B1A2B]/40 hover:bg-[#8B1A2B] text-rose-300 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'messages' ? (
        /* Messages Table */
        <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl overflow-hidden shadow-xl">
          {filteredMessages.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">No messages found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#0A1440] uppercase tracking-wider text-[10px] text-slate-400 font-bold border-b border-[#1B3A6B]">
                  <tr>
                    <th className="px-5 py-4">Sender</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Message Excerpt</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredMessages.map((m) => (
                    <tr key={m._id} className="hover:bg-[#1B3A6B]/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">
                        <div>{m.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{m.email} • {m.city}</div>
                      </td>
                      <td className="px-5 py-4 text-[#E8C468] font-semibold">{m.subject}</td>
                      <td className="px-5 py-4 text-slate-300 max-w-xs truncate">{m.message}</td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(m)}
                            className="p-1.5 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-200 transition-colors"
                            title="View Full Message"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('message', m._id)}
                            className="p-1.5 rounded-lg bg-[#8B1A2B]/40 hover:bg-[#8B1A2B] text-rose-300 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Subscribers Table */
        <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl overflow-hidden shadow-xl">
          {filteredSubscribers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">No subscribers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#0A1440] uppercase tracking-wider text-[10px] text-slate-400 font-bold border-b border-[#1B3A6B]">
                  <tr>
                    <th className="px-5 py-4">Subscriber Email</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Joined Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredSubscribers.map((s) => (
                    <tr key={s._id} className="hover:bg-[#1B3A6B]/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">{s.email}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete('subscriber', s._id)}
                          className="p-1.5 rounded-lg bg-[#8B1A2B]/40 hover:bg-[#8B1A2B] text-rose-300 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121F54] border border-[#C9A227]/50 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl gold-glow">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E8C468]" />
                <span>Lead Detail</span>
              </h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-200">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </span>
                <p className="text-base font-bold text-white">{selectedLead.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </span>
                  <a href={`mailto:${selectedLead.email}`} className="text-[#E8C468] hover:underline font-medium">
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.phone && (
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Phone
                    </span>
                    <a href={`tel:${selectedLead.phone}`} className="text-[#E8C468] hover:underline font-medium">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    City
                  </span>
                  <p>{selectedLead.city || 'N/A'}</p>
                </div>
                {selectedLead.postcode && (
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Postcode
                    </span>
                    <p>{selectedLead.postcode}</p>
                  </div>
                )}
              </div>

              {selectedLead.tier && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Membership Tier
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1B3A6B] text-[#E8C468] border border-[#C9A227]/30 mt-1">
                    {selectedLead.tier}
                  </span>
                </div>
              )}

              {selectedLead.interests && selectedLead.interests.length > 0 && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Interests
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedLead.interests.map((int: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-[#0A1440] text-slate-200 border border-white/10"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedLead.subject && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Subject
                  </span>
                  <p className="text-white font-semibold">{selectedLead.subject}</p>
                </div>
              )}

              {selectedLead.message && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Message Content
                  </span>
                  <div className="p-4 rounded-xl bg-[#0A1440] border border-white/10 text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Submission Date & Time
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-lg bg-[#C9A227] text-[#0A1440] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
